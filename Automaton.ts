/*
const estados = ['q0', 'q1', 'q2', 'q3'];
const alfabeto = ['a', 'b'];
const transicoes = {
  'q0': { 'a': 'q2', 'b': 'q1' },
  'q1': { 'b': 'q0', 'a': 'q3' },
  'q2': { 'a': 'q0', 'b': 'q3' },
  'q3': { 'a': 'q1', 'b': 'q2'}
};
const estadoInicial = 'q0'
const estadosFinais = ['q0']
*/

const estados = ['q0', 'q1', 'q2', 'q3', 'q4']
const alfabeto = ['0', '1']
const transicoes = {
'q0': {'0': 'q1', '1': 'q3'},
'q1': {'0': 'q1', '1': 'q2'},
'q2': {'0': 'q3', '1': 'q4'},
'q3': {'0': 'q3', '1': 'q4'},
'q4': {'0': 'q1', '1': 'q2'}
}

const estadoInicial = 'q0'
const estadosFinais = ['q2', 'q4']







/*
interface State{
    
}
*/
//type State = 'q0' | 'q1' | 'q2' | 'q3'

type linkedState = {
    [row: string]: string
}

type transitionTable = {
    [state: string]: {
        [input: string]: string
    }
}

type Cell = {
    [rowState: string]:
    {
        columnState: string,
        marked: boolean,
        linkedStates: linkedState[]
    }
}

type simplifyTable = {
    [key: string]: Cell
}


class Automata{
    states: string[]
    alphabet: string[]
    transitions : transitionTable
    finalStates: string[]
    tableObj: simplifyTable = {}

    constructor(states: string[], alphabet: string[], transitions: transitionTable, finalStates: string[]){
        this.states = states
        this.alphabet = alphabet
        this.transitions = transitions
        this.finalStates = finalStates
        
    }

    private isFinalState(state: string){
        return this.finalStates.includes(state)
    }

    private findTransition(state: string, symbol: string): string {
        var transition: string = ''
        Object.keys(this.transitions).forEach((key)=>{
            if(key === state){
                const value = this.transitions[key]
                transition = value[symbol]
            }
        })
        return transition
    }


    private searchTable(rowState: string, columnState: string){
        let result: Cell = {}
        Object.keys(this.tableObj).forEach(outerKey=>{
            const innerObject = this.tableObj[outerKey]
            Object.keys(innerObject).forEach(innerKey=>{
                const value = innerObject[innerKey]
                if(innerKey === rowState && value.columnState === columnState) result = {[innerKey]: value}
            })
        })
        return result
    }


    buildTable(){
        var tableObj: simplifyTable = {}
        for(let rowState of this.states){
            for(let columnState of this.states){
                const cell: Cell = {[rowState]: {
                    columnState,
                    marked: rowState == columnState || 
                    //marks as pair-unequivalent final and not-final states
                    ((this.isFinalState(columnState) && !this.isFinalState(rowState))|| (this.isFinalState(rowState) && !this.isFinalState(columnState))),
                    linkedStates: []
                }}

                const key = `${rowState}-${columnState}`
                this.tableObj[key as keyof simplifyTable] = cell
            }
        }
    }

    simplifyEquivalentStates(){
        const pairsToVerify: Cell[] = []

        //iteration over tableObj
        Object.keys(this.tableObj).forEach(outerKey=>{
            const innerObject = this.tableObj[outerKey]
            Object.keys(innerObject).forEach(innerKey=>{
                const value = innerObject[innerKey]
                if(!value.marked) pairsToVerify.push({[innerKey]: value})
            })
        })

        for(const pair of pairsToVerify){
            Object.keys(pair).forEach(key=>{
                const value = pair[key as keyof typeof pair]
                for(const symbol of this.alphabet){
                    // (Qa, Qb) = (key, value.columnState)
                    // (Pa, Pb) = (qx, qy)
                    const qx = this.findTransition(key, symbol)
                    const qy = this.findTransition(value.columnState, symbol)
                    //console.log(`(${key}, ${symbol}) : ${qx}`)
                    //console.log(`(${value.columnState}, ${symbol}): ${qy}`)

                    if(qx !== qy){
                        const pairP = this.searchTable(qx, qy)
                        if(!pairP[qx].marked){
                            pairP[qx].linkedStates.push({[key]: value.columnState})
                        }
                        else{
                            pair[key].marked = true
                            for(const listElement of pair[key].linkedStates){
                                
                            }
                        }
                    }

                }
            })
        }
        Object.keys(this.tableObj).forEach(outerKey=>{
            const innerObject = this.tableObj[outerKey]
            Object.keys(innerObject).forEach(innerKey=>{
                const value = innerObject[innerKey]
                if(!value.marked){
                    console.log(innerKey, value.columnState)
                }
            })
        })
    }
}

const aut = new Automata(estados, alfabeto, transicoes, estadosFinais)
aut.buildTable()
aut.simplifyEquivalentStates()

