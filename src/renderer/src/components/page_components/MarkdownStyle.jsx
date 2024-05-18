import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import style from './style/MarkdownStyle.module.css'

export const MarkdownStyle = (props) => {
  return (
    <p className={style.text}>
      <Markdown remarkPlugins={[remarkGfm]}>{props.text}</Markdown>
    </p>
  )
}

MarkdownStyle.propTypes = {
  text: PropTypes.string.isRequired
}
