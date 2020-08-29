<template>
    <div>
        <section v-if="step === 1">
            <p v-if="loading">carregando...</p>
            <p v-if="catalogo != null">{{ this.planoAtual[0].nome }}</p>
            <p v-if="catalogo != null">R$ {{ this.planoAtual[0].valor }}</p>

            <input type="nome" v-model="nome" placeholder="nome"/> <br>
            <input type="cpf" v-model="cpf" v-mask="['###.###.###-##']" placeholder="cpf" /> <br>
            <input type="tel" v-model="telefone" v-mask="['(##) ####-####', '(##) #####-####']" placeholder="telefone" /> <br>
            <p>{{error}}</p>

            <button @click.prevent="nextStep">
                Continuar
            </button>
        </section>

        <section v-if="step === 2">
            <div v-if="isMobile">
                <h1>{{ nome }}, ótima escolha!</h1>
                <p>O plano <strong>{{ this.planoAtual[0].nome }}</strong> no valor mensal de R${{ this.planoAtual[0].valor }} será ativado na sua linha {{ telefone }}</p>
            </div>

            <div v-if="!isMobile">
                <h1>{{ nome }}, ótima escolha!</h1>
                <p>O plano <strong>{{ this.planoAtual[0].nome }}</strong> no valor mensal de R${{ this.planoAtual[0].valor }} será ativado será ativado em um novo chip.</p>
            </div>
            
            <strong>Mude o Plano</strong>
            <p>
                <select name="planos" @change="setPlanoAtual">
                    <option v-for="plano in listaPlanos" v-bind:key="plano.sku" v-bind:value="plano.sku">
                        {{ plano.nome }}
                    </option>
                </select>
            </p>

        </section>
    </div>
</template>

<script>
import catalogo from '../services/api'
import {mask} from 'vue-the-mask'

export default {
    name: 'Automatus',
    directives: {mask},
    data(){
        return{
            step: 1,
            catalogo: null,
            loading: true,
            nome: '',
            cpf: '',
            telefone: '',
            error: '',
            isMobile: null,
            listaPlanos: [],
            planoAtual: []
        }
    },
    methods:{
        nextStep: function(){
            if(this.nome === '' || this.cpf.length < 14 || this.telefone.length < 14)
            {
                this.error = 'alguns campos estão com problema'
                return
            }
            
            this.telefone.length === 14 ? this.isMobile = false : this.isMobile = true

            this.step ++

            this.getListaPlanos()
        },
        getListaPlanos: function(){
            this.catalogo.controle.map( plano => {
                this.listaPlanos.push({
                    sku: plano.sku, 
                    nome: plano.nome, 
                    valor: plano.valores_plano.valor_com_desconto 
                });
            })
        },
        setPlanoAtual: function(e){
            let novaSKU = e.target.value
            this.planoAtual = this.listaPlanos.filter(item => item.sku === novaSKU)
        }
    },
    mounted(){
        catalogo.post('/', { "uf": null, "cidade": null, "ddd": 21, "view": "" })
        .then(response => {
            this.catalogo = response.data.portfolio
            this.planoAtual.push({
                sku: this.catalogo.controle[0].sku,
                nome: this.catalogo.controle[0].nome,
                valor: this.catalogo.controle[0].valores_plano.valor_com_desconto
                })
        })
        .finally(() => this.loading = false)
    }
}
</script>