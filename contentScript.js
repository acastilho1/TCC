// Classe TextReplacer para substituir palavras ofensivas por sinônimos
class TextReplacer {
    constructor() {
        // Mapeamento de palavras ofensivas e seus sinônimos
        this.offensiveWords = {
            "idiota": "pessoa",
            "burro": "individuo",
            "gay": "Pablo",
            "Louiz":"Goat",
            "Corinthians":"Time ruim",
            "Corno":"Butija"
        };
        // Cache para armazenar regex das palavras ofensivas
        this.regexCache = new Map();
        // Inicializa o processo de substituição de texto
        this.init();
    }

    // Método de inicialização
    init() {
        // Cria padrões regex para as palavras ofensivas
        this.createRegexPatterns();
        // Substitui os nós de texto no corpo do documento
        this.replaceTextNodes(document.body);
        // Configura o MutationObserver para monitorar mudanças no DOM
        this.setupMutationObserver();
    }

    // Cria padrões regex para cada palavra ofensiva
    createRegexPatterns() {
        for (const word of Object.keys(this.offensiveWords)) {
            try {
                const pattern = `\\b${this.escapeRegExp(word)}\\b`;
                this.regexCache.set(word, new RegExp(pattern, "gi"));
            } catch (error) {
                console.error(`Erro ao criar regex para a palavra: ${word}`, error);
            }
        }
    }

    // Escapa caracteres especiais em uma string para uso em regex
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Substitui os nós de texto no nó fornecido
    replaceTextNodes(node) {
        this.walkTextNodes(node, (textNode) => {
            const newContent = this.processText(textNode.textContent);
            if (newContent !== textNode.textContent) {
                this.replaceTextNode(textNode, newContent);
            }
        });
    }

    // Processa o texto substituindo palavras ofensivas por sinônimos
    processText(text) {
        let processedText = text;
        for (const [word, synonym] of Object.entries(this.offensiveWords)) {
            const regex = this.regexCache.get(word);
            if (regex) {
                processedText = processedText.replace(regex, synonym);
            }
        }
        return processedText;
    }

    // Percorre os nós de texto no nó fornecido e aplica um callback
    walkTextNodes(node, callback) {
        if (node.nodeType === Node.TEXT_NODE) {
            callback(node);
        } else {
            for (const child of node.childNodes) {
                this.walkTextNodes(child, callback);
            }
        }
    }

    // Substitui o conteúdo de um nó de texto
    replaceTextNode(textNode, newContent) {
        if (newContent !== textNode.textContent) {
            textNode.textContent = newContent;
        }
    }

    // Configura um MutationObserver para monitorar mudanças no DOM
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!this.isNodeProcessed(node)) {
                        this.replaceTextNodes(node);
                        this.markNodeAsProcessed(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // Verifica se um nó já foi processado
    isNodeProcessed(node) {
        return node.hasAttribute('data-text-replacer-processed');
    }

    // Marca um nó como processado
    markNodeAsProcessed(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            node.setAttribute('data-text-replacer-processed', 'true');
        }
    }
}

// Inicialização do script
(function() {
    try {
        const replacer = new TextReplacer();
    } catch (error) {
        console.error('Erro ao inicializar o TextReplacer:', error);
    }
})();

// Logs para debugging
console.log('TextReplacer ativado');
console.log('Palavras ofensivas configuradas:', Object.keys(offensiveWords));
