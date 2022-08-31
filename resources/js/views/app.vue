<template>
    <div class="container">
        <div class="comments">
            <div class="comments__sort-controls">
                <span>Сортировать по:
                    <span class="byIndex" @click="sortByIndex">индексу<span class="byIndexArrow">&#8593</span></span>
                    <span class="byDate" @click="sortByDate">дате<span class="byDateArrow">&#8593</span></span>
                </span>
            </div>
            <div v-if="getLoadingState" class="comments__loading">
                <div class="lds-roller">
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
            </div>
            <div v-else class="comments__list">
                <div
                    class="comments__item"
                    v-for="comment in comments"
                    :key="comment.id"
                >
                    <div class="comments__header">
                        <h3 class="comments__name">{{ comment.name }}</h3>
                        <div class="comments__date">{{ comment.date }}</div>
                    </div>                    
                    <div class="comments__text">{{ comment.text }}</div>                    
                    <button @click="deleteComment(comment.id)">&#10006</button>
                </div>
            </div>
            <div class="comments__page-controls">
                <button
                    :disabled="getPageIndex == 1"
                    @click="pageIndexManipulation(-1)"
                >
                    &#8249
                </button>
                <button
                    :disabled="getPageIndex >= getPageCount"
                    @click="pageIndexManipulation(1)"
                >
                    &#8250
                </button>
            </div>
        </div>
        <div class="form">
            <form action="#" @submit.prevent="submit">
                <label for="">Имя</label>
                <input id="name" type="text" v-model="name" />
                <label for="">Сообщение</label>
                <input id="text" type="text" v-model="text" />
                <label for="">Дата</label>
                <date-picker v-model="date" type="date" format="DD.MM.YYYY" value-type="DD.MM.YYYY"></date-picker>
                <input :disabled="getLoadingState" type="submit" id="submitBtn" />
            </form>
        </div>
    </div>
</template>
<script>
const default_layout = "default";

import { mapGetters, mapActions, mapMutations } from "vuex";
import DatePicker from 'vue2-datepicker'

export default {
    data() {
        return {
            message: "Hello World",
            name: "",
            text: "",
            date: "30.08.2022"
        };
    },
    computed: {
        ...mapGetters([
            "allComments",
            "comments",
            "getPageIndex",
            "getPageCount",
            "getLastCommentIndex",
            "getLoadingState",
            "getSortDirection"
        ]),
        lastCommentInd() {
            return this.comments[this.comments.length - 1].id + 1;
        }
    },
    methods: {
        ...mapMutations(["pageIndexManipulation", "sortByIndex", "sortByDate"]),
        ...mapActions(["fetchComments", "deleteComment", "addComment"]),
        submit() {
            this.addComment({
                id: this.getLastCommentIndex,
                name: this.name,
                text: this.text,
                date: this.date
            });
            this.name = "",
            this.text = ""
        }
    },
    async mounted() {
        this.fetchComments();
    },
    components: { DatePicker }
};
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: 16px;
}
html, body, #app {
    width: 100%;
    height: 100%;
}
.container {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.comments {
    padding: 10px;
    height: 60%;
    display: flex;
    flex-direction: column;
}
.comments__sort-controls {
    padding: 5px;
}
.byIndexArrow, .byDateArrow {
    display: inline-block;
    transition: .8s ease;
}
.comments__list {
    padding: 5px 0;
    flex: 1 auto;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}
.comments__item {
    height: 30%;
    position: relative;
    display: flex;
    flex-direction: column;
    border-bottom: 1px dashed #000;
}
.comments__item:first-child {
    border-top: 1px dashed #000;
}
.comments__item button {
    width: 30px;
    height: 30px;
    top: 10px;
    right: 10px;
    position: absolute;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.comments__header {
    display: flex;
    align-items: baseline;
}
.comments__name {
    font-weight: bold;
    padding: 5px;
    font-size: 1.3rem;
}
.comments__text {
    flex: 1 auto;
    padding: 5px;
    overflow-y: scroll;
    word-wrap: break-word;
}
.comments__date {
    color: gray;
    padding: 5px;
    font-size: .8rem;
}
.comments__page-controls {
    display: flex;
    justify-content: center;
    -moz-column-gap: 20px;
         column-gap: 20px;
}
.comments__page-controls button {
    font-size: 2rem;
    height: 2.5rem;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: 1px solid #000;
}
#submitBtn {
    align-self: center;
    border: 1px solid #000;    
}
#submitBtn:hover {
    box-shadow: 0 -10px inset;
}
.comments button, #submitBtn, .byIndex, .byDate {
    cursor: pointer;
}
.byIndex, .byDate {
    padding: 0 2px 3px;
    margin: 0 -2px -3px;
}
.byIndex:hover, .byDate:hover {
    border-bottom: 1px solid #000;
}
.form {
    padding: 10px;
    height: 40%;
}
.form > form {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-around;
}
.form > form > label {
    margin: 5px 0;
}
.form label {
    font-size: 1rem;
}
.form input {
    font-size: 1rem;
    padding: 15px 5px;
}
.form input:not(:last-child), .mx-datepicker {
    margin-bottom: 10px;
}
.mx-datepicker .mx-input {
    width: 100%;
}
.mx-icon-clear, .mx-icon-calendar {
    display: none;
}
.mx-datepicker-main.mx-datepicker-popup {
    border: 1px solid #000;
    background-color: #fff;
    padding: 5px;
}

/* loader */
.comments__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 auto;
}
.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  -webkit-animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #000;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  -webkit-animation-delay: -0.036s;
          animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  -webkit-animation-delay: -0.072s;
          animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  -webkit-animation-delay: -0.108s;
          animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  -webkit-animation-delay: -0.144s;
          animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  -webkit-animation-delay: -0.18s;
          animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  -webkit-animation-delay: -0.216s;
          animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  -webkit-animation-delay: -0.252s;
          animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  -webkit-animation-delay: -0.288s;
          animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@-webkit-keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (min-width: 2000px) {
    * {
        font-size: 24px;
    }
}
@media (max-width: 1440px) {
    * {
        font-size: 24px;
    }
}
</style>
