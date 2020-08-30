<template>
    <div id="home">
        <BoxLogo />

        <section class="box">
            <section v-if="step === 1">
                <p v-if="loading">carregando...</p>
               
                <h1 v-if="catalogo != null">
                    {{ this.planoAtual[0].nome }}
                </h1>

                <h2 v-if="catalogo != null">
                    R${{ this.planoAtual[0].valor }}
                </h2>
                
                <form>
                    <p>
                        <label for="nome">Nome Completo</label> <br>
                        <input type="nome" id="nome" v-model="nome" /> 
                    </p>
                    <p>
                        <label for="cpf">CPF</label> <br>
                        <input type="cpf" id="cpf" v-model="cpf" v-mask="['###.###.###-##']" /> 
                    </p>
                    <p>
                        <label for="telefone">Telefone</label> <br>
                        <input type="tel" id="telefone" v-model="telefone" v-mask="['(##) ####-####', '(##) #####-####']" /> 
                    </p>
                    <p>{{error}}</p>

                    <button @click.prevent="nextStep">
                        Continuar
                    </button>
                </form>
            </section>

            <section v-if="step === 2">
                <div v-if="isMobile" class="mensagem">
                    <h1>{{ nome }}, <br>ótima escolha!</h1>
                    <p>O plano <strong>{{ this.planoAtual[0].nome }}</strong> no valor mensal de <strong>R${{ this.planoAtual[0].valor }}</strong> será ativado na sua linha {{ telefone }}.</p>
                </div>

                <div v-if="!isMobile" class="mensagem">
                    <h1>{{ nome }}, <br>ótima escolha!</h1>
                    <p>O plano <strong>{{ this.planoAtual[0].nome }}</strong> no valor mensal de <strong>R${{ this.planoAtual[0].valor }}</strong> será ativado será ativado em um novo chip.</p>
                </div>
                
                
                <p class="select">
                    <strong>Mude o Plano</strong> <br>
                    <select name="planos" @change="setPlanoAtual">
                        <option v-for="plano in listaPlanos" v-bind:key="plano.sku" v-bind:value="plano.sku">
                            {{ plano.nome }}
                        </option>
                    </select>
                </p>
            </section>
        </section>
    </div>
</template>

<script>
import catalogo from '../services/api'
import {mask} from 'vue-the-mask'

import BoxLogo from '../components/BoxLogo'

export default {
    name: 'Automatus',
    directives: {mask},
    components:{
        BoxLogo
    },
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
                this.error = 'Por favor, verifique os campos'
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

<style scoped>

#home{
    display: flex;
}



#home .box{
    width: 50%;
    height: 100vh;
    padding: 25px;
}

#home .box:nth-child(2){
    display: flex;
    align-items: center;
}

.box h1{
    font-size: 55px;
    margin-bottom: 15px;
}

.box h2{
    font-size: 35px;
    margin-bottom: 40px;
}

.box form input{
    width: 450px;
    height: 40px;
    background-color: transparent;
    border: 1px solid #FFF;
    color: #FFF;
    border-radius: 3px;
    margin: 5px 0;
    padding: 5px 10px;
    font-size: 15px;
}

.box form p{
    margin-bottom: 10px;
}

.box form input::placeholder{
    color: #ccc
}

.box form button{
    background: transparent;
    border: 1px solid #FFF;
    color: #FFF;
    padding: 10px 15px;
    font-size: 15px;
    margin-top: 10px;
}

.box .mensagem{
    font-size: 22px;
    max-width: 85%;
}

.box .mensagem strong{
    text-decoration: underline;
}

.box select{
    margin: 5px 0;
    padding: 15px;
    background: transparent;
    color: #FFF;
}

.box .select{
    margin: 25px 0;
}

.box select option{
    background-color: var(--primary-color);
    margin: 5px;
}

@media (max-width: 1024px){
    #home{
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    #home .box{
        width: 100%;
        height: auto;
        justify-content: center;
    }

    .box h1{
        font-size: 25px;
        margin-bottom: 10px;
        width: auto;
    }

    .box h2{
        font-size: 20px;
        margin-bottom: 10px;
    }

    .box form input{
        width: 100%;
    }

    .box .mensagem{
        font-size: 22px;
        max-width: 100%;
    }

}

</style>