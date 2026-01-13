
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
    language?: string;
    value: string;
}

const CodeBlock = ({ language, value }: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="rounded-lg overflow-hidden my-6 border border-slate-700 shadow-xl group">
            <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                <span className="text-xs text-slate-400 font-mono uppercase">{language || 'text'}</span>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#FBBF24] transition-colors"
                        aria-label="Copy code"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-medium">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                    <div className="flex space-x-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                    </div>
                </div>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '1.5rem', background: '#0f172a' }} // bg-slate-900
                showLineNumbers={true}
                lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#475569', textAlign: 'right' }}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
