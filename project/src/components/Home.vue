<template>
    <div>       
        <section>
            <p v-if="loading">carregando...</p>
            <p v-if="catalogo != null">{{ this.catalogo.controle[0].nome }}</p>
            <p v-if="catalogo != null">R$ {{ this.catalogo.controle[0].valores_plano.valor_com_desconto }}</p>
        </section>
    </div>
</template>

<script>
import catalogo from '../services/api'

export default {
    name: 'Home',
    data(){
        return{
            catalogo: null,
            loading: true,
        }
    },
    mounted(){
        catalogo.post('/', { "uf": null, "cidade": null, "ddd": 21, "view": "" }).then(response => {
            this.catalogo = response.data.portfolio
        })
        .finally(() => this.loading = false)
    }
}
</script>