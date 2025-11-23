import React from "react";
import ButtonGradient from "./ButtonGradient";

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress }) => {
    return <ButtonGradient title={title} onPress={onPress} />;
};

export default PrimaryButton;