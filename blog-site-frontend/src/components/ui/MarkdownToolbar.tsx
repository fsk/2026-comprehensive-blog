import { useState } from 'react';
import { Image, Code, Bold, Italic, Link as LinkIcon, List, Heading1, Heading2, Heading3, Quote, ChevronDown, Underline, Highlighter, Minus, StickyNote, Palette } from 'lucide-react';
import Tooltip from './Tooltip';

interface MarkdownToolbarProps {
    onInsert: (prefix: string, suffix?: string) => void;
}

const MarkdownToolbar = ({ onInsert }: MarkdownToolbarProps) => {
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [showColorMenu, setShowColorMenu] = useState(false);
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);

    const languages = [
        { name: 'Java', id: 'java', description: '```java ... ```' },
        { name: 'JavaScript', id: 'javascript', description: '```javascript ... ```' },
        { name: 'TypeScript', id: 'typescript', description: '```typescript ... ```' },
        { name: 'Python', id: 'python', description: '```python ... ```' },
        { name: 'Go', id: 'go', description: '```go ... ```' },
        { name: 'YAML', id: 'yaml', description: '```yaml ... ```' },
        { name: 'Bash', id: 'bash', description: '```bash ... ```' },
        { name: 'SQL', id: 'sql', description: '```sql ... ```' },
        { name: 'JSON', id: 'json', description: '```json ... ```' },
    ];

    const colors = [
        { name: 'Red', value: '#ef4444' },
        { name: 'Gold', value: '#EA580C' },
        { name: 'Yellow', value: '#FBBF24' },
        { name: 'Green', value: '#22c55e' },
        { name: 'Purple', value: '#a855f7' },
    ];

    const headings = [
        { name: 'Başlık 1', value: '# ', icon: Heading1, explanation: 'En büyük ana başlık', description: '# Ana Başlık' },
        { name: 'Başlık 2', value: '## ', icon: Heading2, explanation: 'Orta boy alt başlık', description: '## Alt Başlık' },
        { name: 'Başlık 3', value: '### ', icon: Heading3, explanation: 'Küçük alt başlık', description: '### Küçük Başlık' },
    ];

    const handleLanguageSelect = (langId: string) => {
        onInsert(`\n\`\`\`${langId}\n`, `\n\`\`\`\n`);
        setShowLanguageMenu(false);
    };

    const handleColorSelect = (color: string) => {
        onInsert(`<span style="color: ${color}">`, `</span>`);
        setShowColorMenu(false);
    };

    const handleHeadingSelect = (prefix: string) => {
        onInsert(prefix, '');
        setShowHeadingMenu(false);
    };

    const tools = [
        // Heading is now handled separately
        { icon: Bold, label: 'Bold', tooltip: 'Kalın', explanation: 'Yazıları kalınlaştırır', description: '**metin**', action: () => onInsert('**', '**') },
        { icon: Italic, label: 'Italic', tooltip: 'İtalik', explanation: 'Yazıları italik (eğik) yapar', description: '_metin_', action: () => onInsert('_', '_') },
        { icon: Underline, label: 'Underline', tooltip: 'Altı Çizili', explanation: 'Seçili metnin altını çizer', description: '<u>metin</u>', action: () => onInsert('<u>', '</u>') },
        { icon: Highlighter, label: 'Highlight', tooltip: 'Vurgula', explanation: 'Metnin arkasını renklendirir', description: '<mark>metin</mark>', action: () => onInsert('<mark>', '</mark>') },
        { icon: LinkIcon, label: 'Link', tooltip: 'Bağlantı', explanation: 'Tıklanabilir link ekler', description: '[başlık](url)', action: () => onInsert('[', '](url)') },
        { icon: Image, label: 'Image', tooltip: 'Görsel', explanation: 'Resim veya ekran görüntüsü ekler', description: '![açıklama](url)', action: () => onInsert('![alt text](', ')') },
        { icon: Quote, label: 'Quote', tooltip: 'Alıntı', explanation: 'Alıntı bloğu oluşturur', description: '> metin', action: () => onInsert('> ', '') },
        { icon: StickyNote, label: 'Note', tooltip: 'Not / Uyarı', explanation: 'Bilgi veya uyarı kutusu ekler', description: '> [!NOTE]', action: () => onInsert('> [!NOTE]\n> ', '') },
        { icon: List, label: 'List', tooltip: 'Liste', explanation: 'Madde işaretli liste başlatır', description: '- öğe', action: () => onInsert('- ', '') },
        { icon: Minus, label: 'Separator', tooltip: 'Ayraç', explanation: 'Yatay ayırıcı çizgi ekler', description: '---', action: () => onInsert('\n---\n', '') },
    ];

    const toggleLanguageMenu = () => {
        setShowLanguageMenu(!showLanguageMenu);
        setShowColorMenu(false);
        setShowHeadingMenu(false);
    }

    const toggleColorMenu = () => {
        setShowColorMenu(!showColorMenu);
        setShowLanguageMenu(false);
        setShowHeadingMenu(false);
    }

    const toggleHeadingMenu = () => {
        setShowHeadingMenu(!showHeadingMenu);
        setShowLanguageMenu(false);
        setShowColorMenu(false);
    }

    return (
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-2 rounded-t-xl border-b border-slate-200 dark:border-slate-700">

            {/* Heading Menu */}
            <div className="relative">
                <Tooltip content="Başlıklar" explanation="Hiyerarşik başlıklar ekler" description="# Başlık 1, ## Başlık 2">
                    <button
                        onClick={toggleHeadingMenu}
                        type="button"
                        className={`p-2 flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#EA580C] dark:hover:text-[#FBBF24] hover:bg-[#FBBF24]/10 dark:hover:bg-[#FBBF24]/5 rounded-lg transition-colors ${showHeadingMenu ? 'bg-[#FBBF24]/10 dark:bg-[#FBBF24]/5 text-[#EA580C]' : ''}`}
                    >
                        <Heading2 className="w-5 h-5" />
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </Tooltip>

                {showHeadingMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowHeadingMenu(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-20">
                            {headings.map((h) => (
                                <button
                                    key={h.name}
                                    onClick={() => handleHeadingSelect(h.value)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-[#FBBF24]/10 selection:bg-[#FBBF24]/20 transition-colors flex items-center gap-2 group"
                                >
                                    <h.icon className="w-4 h-4 text-slate-400 group-hover:text-[#EA580C]" />
                                    <span>{h.name}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 flex-shrink-0" />

            {/* Standard Tools */}
            {tools.map((tool) => (
                <Tooltip key={tool.label} content={tool.tooltip} description={tool.description}>
                    <button
                        onClick={tool.action}
                        type="button"
                        className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#EA580C] dark:hover:text-[#FBBF24] hover:bg-[#FBBF24]/10 dark:hover:bg-[#FBBF24]/5 rounded-lg transition-colors flex-shrink-0"
                    >
                        <tool.icon className="w-5 h-5" />
                    </button>
                </Tooltip>
            ))}

            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 flex-shrink-0" />

            {/* Code Language Menu */}
            <div className="relative">
                <Tooltip content="Kod Bloğu" description="```dil ... ```">
                    <button
                        onClick={toggleLanguageMenu}
                        type="button"
                        className={`p-2 flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#EA580C] dark:hover:text-[#FBBF24] hover:bg-[#FBBF24]/10 dark:hover:bg-[#FBBF24]/5 rounded-lg transition-colors ${showLanguageMenu ? 'bg-[#FBBF24]/10 dark:bg-[#FBBF24]/5 text-[#EA580C]' : ''}`}
                    >
                        <Code className="w-5 h-5" />
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </Tooltip>

                {showLanguageMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowLanguageMenu(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-20 max-h-64 overflow-y-auto">
                            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Select Language
                            </div>
                            {languages.map((lang) => (
                                <button
                                    key={lang.id}
                                    onClick={() => handleLanguageSelect(lang.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-[#FBBF24]/10 hover:text-[#EA580C] dark:hover:text-[#FBBF24] transition-colors flex items-center justify-between group"
                                >
                                    <span className="font-mono">{lang.name}</span>
                                    <Code className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#EA580C]" />
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Color Menu */}
            <div className="relative">
                <Tooltip content="Metin Rengi" description="<span style='color: ...'>">
                    <button
                        onClick={toggleColorMenu}
                        type="button"
                        className={`p-2 flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-[#EA580C] dark:hover:text-[#FBBF24] hover:bg-[#FBBF24]/10 dark:hover:bg-[#FBBF24]/5 rounded-lg transition-colors ${showColorMenu ? 'bg-[#FBBF24]/10 dark:bg-[#FBBF24]/5 text-[#EA580C]' : ''}`}
                    >
                        <Palette className="w-5 h-5" />
                        <ChevronDown className="w-3 h-3" />
                    </button>
                </Tooltip>

                {showColorMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowColorMenu(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-20 max-h-64 overflow-y-auto">
                            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Select Color
                            </div>
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => handleColorSelect(color.value)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-[#FBBF24]/10 transition-colors flex items-center justify-between group"
                                >
                                    <span>{color.name}</span>
                                    <div className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600" style={{ backgroundColor: color.value }}></div>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MarkdownToolbar;
