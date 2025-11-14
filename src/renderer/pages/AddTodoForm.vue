<template>
    <div class="container">
        <form @submit.prevent="handleAdd">
            <button type="button" class="back-button" @click="handleBack">&larr; Retour</button>
            <input v-model="wineName" type="text" name="wineName" placeholder="Nom du vin" required>
            <input v-model="producer" type="text" name="producer" placeholder="Producteur">
            <input v-model="region" type="text" name="region" placeholder="Région">
            <input v-model="date" type="date" name="date">
            <button type="submit">Ajouter le vin</button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import Todo from 'src/shared/todo';
import { ref } from 'vue';
import { useTodos } from '../composables/todos';
import { useRouter } from 'vue-router';

const { addTodo } = useTodos();
const router = useRouter();

const wineName = ref('');
const producer = ref('');
const region = ref('');
const date = ref<string>(new Date().toISOString().split('T')[0])

const normalize = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
}

const handleBack = () => router.back();

const handleAdd = async () => {
    const todo = {
        title: wineName.value.trim(),
        producer: normalize(producer.value),
        region: normalize(region.value),
        dateLimite: new Date(date.value),
        isFinished: false
    } as Todo;

    if (!todo.title.length) {
        return;
    }

    await addTodo(todo);

    wineName.value = '';
    producer.value = '';
    region.value = '';
    date.value = new Date().toISOString().split('T')[0];

    router.push('/');
}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    background-color: #2c3e50;
    border-radius: .5rem;
    box-shadow: 10px 10px 30px rgba(0, 0, 0, .2);
    min-width: 500px;
}

input {
    padding: 0.75rem 1rem;
    border: 2px solid #34495e;
    border-radius: 8px;
    background-color: #34495e;
    color: #ecf0f1;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;
}

input:focus {
    border-color: #3498db;
    background-color: #2c3e50;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
}

input::placeholder {
    color: #95a5a6;
}

button {
    background: #3b82f6;
    border: none;
    color: white;
    padding: 1rem 2rem;
    border-radius: .5rem;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
    cursor: pointer;
    transition: ease-in-out .2s;
}

button:hover {
    transform: translateY(-5px);
}

.back-button {
    align-self: flex-start;
    background: transparent;
    color: #e2e8f0;
    padding: 0;
    box-shadow: none;
    font-weight: 500;
    transition: color .2s ease;
}

.back-button:hover {
    transform: none;
    color: #ffffff;
}
</style>
