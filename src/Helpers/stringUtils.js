export const toSentenceCase = (str) => {

    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


export const TruncateText = (text, limit) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";

}