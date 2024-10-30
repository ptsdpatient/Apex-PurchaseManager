<script>
	import { onMount } from 'svelte';

    let token;
    let url='http://localhost:2000'
    let purchases=[]


    async function authenticateToken() {

        if (!token) {
            alert("No token found")
            window.location='/login'
        }

        try {
            const response = await fetch(`${url}/authenticateToken`, {
                method: 'POST', // Use POST or GET depending on your API
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Attach the token in the Authorization header
                }
            });

            if (!response.ok) {
                // window.location='/login'
            }

            const data = await response.json();
            alert(data)
        } catch (error) {
            return { error: 'Network error or server not reachable' };
        }
    }

    async function fetchPurchases() {
        try {
            const response = await fetch('http://localhost:2000/getPurchases', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Assuming you store the token in localStorage
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch purchases');
            }

            const data = await response.json();
            purchases = data; // Store the fetched data
        } catch (error) {
            errorMessage = error.message;
        }
    }

    function fetchInfo(){

        fetchPurchases();
    }

    onMount(()=>{
        token = localStorage.getItem('pmToken');
        authenticateToken()

        fetchInfo()
    })

</script>

<div class="flex flex-col" style="height:100svh;width:100vw;">
    <div class="fixed w-full flex px-10 flex-row gap-3 bg-purple-700 py-2 text-xl text-white">
        <button class="px-5 rounded-lg transition-all duration-300 hover:bg-purple-600 py-2">Purchases</button>
        <button class="px-5 rounded-lg transition-all duration-300 hover:bg-purple-600 py-2">Employees</button>
    </div>
    <div class="w-full pt-10 mt-10 h-full bg-white">
        <div class="flex flex-row justify-around ">

        </div>
        <table class="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead class="bg-gray-200">
                <tr>
                    <th class="py-2 px-4 border-b text-left">ID</th>
                    <th class="py-2 px-4 border-b text-left">Date of Purchase</th>
                    <th class="py-2 px-4 border-b text-left">Company Name</th>
                    <th class="py-2 px-4 border-b text-left">Item Name</th>
                    <th class="py-2 px-4 border-b text-left">Quantity</th>
                    <th class="py-2 px-4 border-b text-left">Cost</th>
                    <th class="py-2 px-4 border-b text-left">Delivery Memo</th>
                    <th class="py-2 px-4 border-b text-left">Customer Name</th>
                    <th class="py-2 px-4 border-b text-left">Purchase Description</th>
                </tr>
            </thead>
            <tbody>
                {#each purchases as purchase}
                    <tr class="hover:bg-gray-100">
                        <td class="py-2 px-4 border-b">{purchase.id}</td>
                        <td class="py-2 px-4 border-b">{purchase.date_of_purchase}</td>
                        <td class="py-2 px-4 border-b">{purchase.company_name}</td>
                        <td class="py-2 px-4 border-b">{purchase.item_name}</td>
                        <td class="py-2 px-4 border-b">{purchase.quantity}</td>
                        <td class="py-2 px-4 border-b">{purchase.cost}</td>
                        <td class="py-2 px-4 border-b">{purchase.delivery_memo_number}</td>
                        <td class="py-2 px-4 border-b">{purchase.customer_name}</td>
                        <td class="py-2 px-4 border-b">{purchase.purchase_description}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>