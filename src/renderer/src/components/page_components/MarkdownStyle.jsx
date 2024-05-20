import { useEffect } from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import './style/MarkdownStyle.css'

export const MarkdownStyle = (props) => {
  // for syntax highlighting
  useEffect(() => {
    hljs.highlightAll()
  }, [])

  return (
    <p className="markdownText">
      <Markdown remarkPlugins={[remarkGfm]}>{props.text}</Markdown>
    </p>
  )
}

MarkdownStyle.propTypes = {
  text: PropTypes.string.isRequired
}
