export const getSubjectColor = (subjectName) => {
    const colors = {
        english: "#3b82f6", // Blue
        mathematics: "#ef4444", // Red
        physics: "#8b5cf6", // Purple
        chemistry: "#f59e0b", // Amber
        biology: "#10b981", // Emerald
        economics: "#06b6d4", // Cyan
        government: "#ec4899", // Pink
        default: "#94a3b8" // Slate
    };
    const key = subjectName.toLowerCase().includes("english") ? "english" : subjectName.toLowerCase().split(" ")[0];
    return colors[key] || colors.default;
};