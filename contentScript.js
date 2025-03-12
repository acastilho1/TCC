console.log("script carregado")

const offensiveWords = {
    "idiota":"pessoa",
    "burro":"individuo"
};

function replaceOffensiveWords(text){
    for(const [word , synonym] of Object.entries(offensiveWords)){
        const regex = new RegExp(word, "gi");
        text = text.replace(regex, synonym);
    }
    return text;
}


document.body.innerHTML = replaceOffensiveWords(document.body.innerHTML);