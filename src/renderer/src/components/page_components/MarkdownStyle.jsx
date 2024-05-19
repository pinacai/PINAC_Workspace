import { useEffect } from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import './style/MarkdownStyle.css'

export const MarkdownStyle = (props) => {
  useEffect(() => {
    // hljs.configure({ classPrefix: 'dark-hljs-' })
    hljs.highlightAll()
  }, [])

  // Remove unwanted newlines from the Markdown content
  // const formattedText = props.text.replace(/\n\s*\n/g, '\n')

  return (
    <p className="markdownText">
      <Markdown remarkPlugins={[remarkGfm]}>{props.text}</Markdown>
    </p>
  )
}

MarkdownStyle.propTypes = {
  text: PropTypes.string.isRequired
}
