import { useState, useEffect } from 'react';

interface TypewriterProps {
    texts: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    className?: string;
    cursorClassName?: string;
}

const Typewriter = ({
    texts,
    typingSpeed = 50, // Fast
    deletingSpeed = 30, // Fast delete
    pauseDuration = 1500,
    className,
    cursorClassName
}: TypewriterProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const handleTyping = () => {
            const currentText = texts[textIndex];

            if (isDeleting) {
                setDisplayedText(currentText.substring(0, displayedText.length - 1));
            } else {
                setDisplayedText(currentText.substring(0, displayedText.length + 1));
            }

            if (!isDeleting && displayedText === currentText) {
                setTimeout(() => setIsDeleting(true), pauseDuration);
            } else if (isDeleting && displayedText === '') {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
            }
        };

        const timer = setTimeout(
            handleTyping,
            isDeleting ? deletingSpeed : typingSpeed
        );

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className={className}>
            {displayedText}
            <span className={`inline-block w-[3px] h-[1.1em] bg-current ml-1 align-middle animate-blink ${cursorClassName}`}></span>
        </span>
    );
};

export default Typewriter;
