<script>
	import { onMount } from 'svelte';

    let token;
    let username='',password=''
    let url='http://localhost:2000'

    async function login() {
    try {
        const response = await fetch(`${url}/login`, {
            method: 'POST', // Use POST for login requests
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Attach the token in the Authorization header
            },
            body: JSON.stringify({ // Convert the object to a JSON string
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        localStorage.setItem('pmToken', data.token);
        window.location='/'
    } catch (error) {
        return { error: 'Network error or server not reachable' };
    }
}


    async function authenticateToken() {

        try {
            const response = await fetch(`${url}/authenticateToken`, {
                method: 'POST', // Use POST or GET depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Attach the token in the Authorization header
                }
            });

            const data = await response.json();
            alert(data)
        } catch (error) {
            return { error: 'Network error or server not reachable' };
        }
    }

    onMount(()=>{
        token = localStorage.getItem('pmToken');
        authenticateToken()
    })

</script>


<div class="flex flex-row justify-center bg-purple-800" style="height:100svh;width:100vw;">
    <div class="w-1/3 h-full flex flex-col justify-center">
        <div class="flex flex-col bg-purple-700  p-10 gap-2 text-xl text-white rounded-lg">
            <div class="text-4xl  mb-6">Apex Purchase Manager</div>
            <div>Username : </div>
            <input bind:value={username} placeholder="username" class="text-black rounded-lg py-2 px-4">
            <div>Password : </div>
            <input bind:value={password} placeholder="password" class="text-black rounded-lg py-2 px-4">
            <button on:click={login} class="mx-auto transition-all duration-300 mt-5 bg-white hover:shadow-xl  transform hover:scale-105 rounded-lg w-1/3 p-3 text-purple-700 hover:bg-white">Login</button>
        </div>
    </div>

</div>