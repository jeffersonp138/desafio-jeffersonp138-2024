class RecintosZoo {

    constructor() {
        // Lista de animais permitidos no zoo
        this.listaPermitidos = [
          { animalNome: 'LEAO', tamanhoAnimal: 3, bioma: 'savana', carnivoro: true },
          { animalNome: 'LEOPARDO', tamanhoAnimal: 2, bioma: 'savana', carnivoro: true },
          { animalNome: 'CROCODILO', tamanhoAnimal: 3, bioma: 'rio', carnivoro: true },
          { animalNome: 'MACACO', tamanhoAnimal: 1, bioma: ['savana', 'floresta'], carnivoro: false },
          { animalNome: 'GAZELA', tamanhoAnimal: 2, bioma: 'saavana', carnivoro: false},
          { animalNome: 'HIPOPOTAMO', tamanhoAnimal: 3, bioma: ['rio', 'savana'], carnivoro: false }
        ];
    
        // Lista de recintos disponiveis no zoológico
        this.recintos = [
          { numRecinto: 1, bioma: 'savana', tamanhoTotal: 10, animaisAlocados: [['MACACO', 3]] },
          { numRecinto: 2, bioma: 'floresta', tamanhoTotal: 5, animaisAlocados: [] },
          { numRecinto: 3, bioma: ['savana', 'rio'], tamanhoTotal: 7, animaisAlocados: [['GAZELA', 1]] },
          { numRecinto: 4, bioma: 'rio', tamanhoTotal: 8, animaisAlocados: [] },
          { numRecinto: 5, bioma: 'savana', tamanhoTotal: 9, animaisAlocados: [['LEAO', 1]] }
        ];
      }

      validarAnimal(animal) {
        return this.listaPermitidos.find(a => a.animalNome === animal.toUpperCase());
      }

    analisaRecintos(animal, quantidade) {
       // Validar se o animal é permitido
    const animalPermitido = this.validarAnimal(animal);
    if (!animalPermitido) {
        return { erro: 'Animal inválido' };
    }

    // Validar se a quantidade é maior que 0
    if (quantidade <= 0) {
        return { erro: 'Quantidade inválida' };
    }

    // Filtrar recintos viáveis
    const recintosViaveis = this.recintos.filter(recinto => {
        // Verificar compatibilidade de biomas
        const biomaValido = Array.isArray(animalPermitido.bioma)
            ? animalPermitido.bioma.some(b => Array.isArray(recinto.bioma) ? recinto.bioma.includes(b) : recinto.bioma === b)
            : recinto.bioma === animalPermitido.bioma || Array.isArray(recinto.bioma) && recinto.bioma.includes(animalPermitido.bioma);

        if (!biomaValido) return false;

        // Verificar se o animal carnívoro está com a própria espécie
        if (animalPermitido.carnivoro && recinto.animaisAlocados.length > 0) {
            const outrosAnimais = recinto.animaisAlocados.filter(([nome]) => nome !== animal.toUpperCase());
            if (outrosAnimais.length > 0) return false; // Carnívoro não pode conviver com outras espécies
        }

        // Calcular espaço ocupado no recinto
        let espacoOcupado = 0;
        let diferentesAnimais = false;
        recinto.animaisAlocados.forEach(([animalAlocado, qtd]) => {
            const animalExistente = this.listaPermitidos.find(a => a.animalNome === animalAlocado);
            if (animalExistente) {
                espacoOcupado += animalExistente.tamanhoAnimal * qtd;
                if (animalAlocado !== animal.toUpperCase()){
                    diferentesAnimais = true;
                }
            }
        });

        // Verificar espaço disponível no recinto
        let tamanhoDisponivel = recinto.tamanhoTotal - espacoOcupado;

        // Calcular espaço necessário para os novos animais
        let espacoNecessario = animalPermitido.tamanhoAnimal * quantidade;


        if (animal === 'MACACO' && recinto.animaisAlocados.length === 0 && quantidade === 1) {
            return false;
        }

        // Verificar se há espaço suficiente para os novos animais
        if (tamanhoDisponivel >= espacoNecessario) {
            return true;
        }

        return false;
    });

    if (recintosViaveis.length === 0) {
        return { erro: 'Não há recinto viável' };
    }

    // Retornar recintos viáveis com o espaço livre e total
    return {
        recintosViaveis: recintosViaveis
            .sort((a, b) => a.numRecinto - b.numRecinto)
            .map(recinto => {
                let espacoOcupado = 0;
                recinto.animaisAlocados.forEach(([animalAlocado, qtd]) => {
                    const animalExistente = this.listaPermitidos.find(a => a.animalNome === animalAlocado);
                    espacoOcupado += animalExistente.tamanhoAnimal * qtd;
                });

                // Calcular o tamanho disponível
                let tamanhoDisponivel = recinto.tamanhoTotal - espacoOcupado;

                let espacoNecessario = this.validarAnimal(animal).tamanhoAnimal * quantidade;
                
                // Ajuste de espaço quando há espécies diferentes
                const especiesDiferentes = new Set(recinto.animaisAlocados.map(([nome]) => nome)).size;
                if (especiesDiferentes > 1) {
                    espacoNecessario = espacoNecessario + 1; 
                } //O TESTE NÃO CONSEGUE COBRIR ESSE TRECHO DO CÓDIGO, O QUE ESTÁ DANDO ERRO.

                const espacoDisponivelPosAlocacao = tamanhoDisponivel - espacoNecessario;

                return `Recinto ${recinto.numRecinto} (espaço livre: ${espacoDisponivelPosAlocacao} total: ${recinto.tamanhoTotal})`;
            })
    };
}
}

export { RecintosZoo as RecintosZoo };





