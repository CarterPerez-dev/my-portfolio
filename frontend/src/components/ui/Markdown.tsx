/**
 * ©AngelaMos | 2025
 * Markdown.tsx
 */

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import styles from './markdown.module.scss'

interface MarkdownProps {
  content: string
  className?: string
}

const customStyle: React.CSSProperties = {
  margin: 0,
  padding: '1rem',
  borderRadius: '6px',
  fontSize: '0.8125rem',
  lineHeight: 1.6,
  backgroundColor: 'hsl(0, 0%, 9%)',
  border: '1px solid hsl(0, 0%, 18%)',
}

const codeStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: 'hsl(0, 0%, 9%)',
    margin: 0,
    padding: 0,
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'transparent',
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
  },
} as { [key: string]: React.CSSProperties }

export function Markdown({
  content,
  className,
}: MarkdownProps): React.ReactElement {
  return (
    <div className={`${styles.markdown} ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className ?? '')
            const codeString = String(children).replace(/\n$/, '')

            if (match) {
              return (
                <SyntaxHighlighter
                  style={codeStyle}
                  language={match[1]}
                  PreTag="div"
                  customStyle={customStyle}
                  wrapLongLines
                >
                  {codeString}
                </SyntaxHighlighter>
              )
            }

            return (
              <code className={styles.inlineCode} {...props}>
                {children}
              </code>
            )
          },
          h2({ children, ...props }) {
            const id = String(children)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
            return (
              <h2 id={id} className={styles.h2} {...props}>
                {children}
              </h2>
            )
          },
          h3({ children, ...props }) {
            const id = String(children)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '')
            return (
              <h3 id={id} className={styles.h3} {...props}>
                {children}
              </h3>
            )
          },
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith('http')
            return (
              <a
                href={href}
                className={styles.link}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                {...props}
              >
                {children}
                {isExternal && <span className={styles.externalIcon}>↗</span>}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
