// components/PromptSuggestionButton.tsx
interface PromptSuggestionButtonProps {
    suggestion: string;
    onClick: () => void;
}

const PromptSuggestionButton = ({
                                    suggestion,
                                    onClick
                                }: PromptSuggestionButtonProps) => {
    return (
        <button className="suggestion-button" onClick={onClick}>
            {suggestion}
        </button>
    );
};

export default PromptSuggestionButton;