from datetime import datetime
import re


class WebSearchAssistant:
    """Class for a web search-enabled conversational assistant"""

    def __init__(self, chat_model=None, conversation_history=[], search_engine=None):
        self.chat_model = chat_model
        self.conversation_history = conversation_history
        self.current_date = datetime.now().strftime("%B %d, %Y")
        self.search_engine = search_engine
        # Initialize with system instruction
        self.conversation_history.insert(
            0,
            {
                "role": "system",
                "content": "You are a helpful AI assistant that can search the web for information. For factual questions, you'll provide up-to-date information in brief by searching the web.",
            },
        )

    def _should_search(self, query):
        """Use simple heuristics to determine if search is needed"""
        # Check for factual question indicators
        factual_indicators = [
            "what",
            "who",
            "when",
            "where",
            "how",
            "why",
            "which",
            "is",
            "are",
            "was",
            "were",
            "did",
            "do",
            "does",
            "can",
        ]

        # Check if query is a question or contains factual keywords
        is_question = "?" in query or any(
            query.lower().startswith(word) for word in factual_indicators
        )

        # Check if it might be a follow-up question
        is_short_query = len(query.split()) <= 5
        contains_pronoun = any(
            pronoun in query.lower().split()
            for pronoun in ["it", "this", "that", "they", "these", "those"]
        )

        # If short query with pronouns and we have conversation history, likely a follow-up
        previous_questions = [
            msg["content"] for msg in self.conversation_history if msg["role"] == "user"
        ]
        is_follow_up = (
            is_short_query and contains_pronoun and len(previous_questions) > 0
        )

        # Check if query is asking for factual information
        contains_entity = re.search(r"[A-Z][a-z]+", query) is not None

        return is_question or is_follow_up or contains_entity

    def _create_search_query(self, query):
        """Create effective search query based on conversation context (fallback method)"""
        # If query is likely a follow-up, add context from previous exchanges
        previous_msgs = [
            msg
            for msg in self.conversation_history
            if msg["role"] in ["user", "assistant"]
        ]

        if len(previous_msgs) >= 2 and len(query.split()) <= 5:
            # Get the last question and answer
            last_question = next(
                (
                    msg["content"]
                    for msg in reversed(previous_msgs)
                    if msg["role"] == "user"
                ),
                "",
            )
            last_answer = next(
                (
                    msg["content"]
                    for msg in reversed(previous_msgs)
                    if msg["role"] == "assistant"
                ),
                "",
            )

            # Extract key entities from previous exchange
            entities = re.findall(r"[A-Z][a-z]+", last_question + " " + last_answer)
            context = " ".join(entities[:3])  # Use up to 3 key entities

            # Combine context with current query for better search
            if context:
                return f"{context} {query}"

        return query

    def _generate_llm_search_query(self, query):
        """Generate an effective search query using the LLM"""
        try:
            # Create a copy of conversation history
            temp_history = self.conversation_history.copy()
            search_instruction = {
                "role": "system",
                "content": (
                    f"Today is {self.current_date}. Your task is to generate the most effective web search query based on the conversation history and the latest user question. For follow-up questions, include necessary context from previous messages. Respond ONLY with the search query text - no explanations, no quotation marks, just the query itself."
                ),
            }

            # Add the instruction as a temporary system message
            temp_history.append(search_instruction)

            # Generate the search query
            generated_query = self.chat_model._generate(temp_history).strip()

            # Remove any quotation marks or prefixes like "Search query:" if present
            generated_query = re.sub(
                r"^(search query:|query:|searching for:)\s*",
                "",
                generated_query,
                flags=re.IGNORECASE,
            )
            generated_query = generated_query.strip("\"'")

            # If the generated query is too short, fall back to original query
            if len(generated_query.split()) <= 1:
                return query

            return generated_query

        except Exception as e:
            print(f"[DEBUG] Error generating LLM search query: {str(e)}", flush=True)
            # Fall back to heuristic method
            return self._create_search_query(query)

    def process_query(self, query):
        """Process user query using conversation history and web search"""

        self.conversation_history.append({"role": "user", "content": query})

        try:
            if self._should_search(query):
                # Create search query using LLM
                search_query = self._generate_llm_search_query(query)
                print(f"[DEBUG] Searching for: {search_query}", flush=True)

                # Perform web search
                search_results = self.search_engine(search_query)

                if search_results:
                    # Add search results as context
                    search_context = f"Based on recent web information about '{search_query}': {search_results}"
                    temp_messages = self.conversation_history.copy()
                    temp_messages.append({"role": "system", "content": search_context})

                    # Generate response with search results
                    answer = self.chat_model._generate(temp_messages)
                else:
                    # Fallback if search returned no results
                    answer = self.chat_model._generate(self.conversation_history)
            else:
                # No search needed
                answer = self.chat_model._generate(self.conversation_history)

            return answer

        except Exception as e:
            print(f"Error: {str(e)}", flush=True)
            # Provide fallback response
            return "I apologize, but I'm having trouble processing your request. Could you please rephrase your question?"
