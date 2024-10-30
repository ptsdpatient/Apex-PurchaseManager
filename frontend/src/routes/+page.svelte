<script>
	import { onMount } from 'svelte';

    let token;
    let url='http://localhost:2000'
    let purchases=[]
    let employees=[]
    let items=[]
    let menuTable=0

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
    <div class="w-full flex px-5 flex-row gap-3 bg-purple-800 py-2 justify-between text-xl text-white">
        <div class='flex flex-row gap-4'>
            <button on:click={()=> menuTable=0} class="px-5 rounded-lg transition-all duration-300 hover:bg-purple-600 {menuTable==0?"bg-purple-600":""}  py-2">Purchases</button>
            <button on:click={()=> menuTable=1} class="px-5 rounded-lg transition-all duration-300 hover:bg-purple-600 {menuTable==1?"bg-purple-600":""} py-2">Employees</button>    
            <button on:click={()=> menuTable=2} class="px-5 rounded-lg transition-all duration-300 hover:bg-purple-600 {menuTable==2?"bg-purple-600":""} py-2">Items</button>    
        </div>
            <button class="px-5 rounded-lg transition-all duration-300 hover:bg-purple-600 py-2">Create +</button>    
        
    </div>
    <div class="w-full px-5 pt-5 h-full bg-white">        
        {#if menuTable ==0}
            <table class="min-w-full rounded-lg bg-white border border-gray-300 rounded-lg shadow-md">
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
            {:else if menuTable==1}
                <table class="min-w-full rounded-lg bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="py-2 px-4 border-b text-left">ID</th>
                            <th class="py-2 px-4 border-b text-left">Employee Name</th>
                            <th class="py-2 px-4 border-b text-left">Employee Mobile</th>
                            <th class="py-2 px-4 border-b text-left">Company</th>
                            <th class="py-2 px-4 border-b text-left">Purchases</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each employees as employee}
                            <tr class="hover:bg-gray-100">
                                <td class="py-2 px-4 border-b">{employee.id}</td>
                                <td class="py-2 px-4 border-b">{employee.full_name}</td>
                                <td class="py-2 px-4 border-b">{employee.mobile}</td>
                                <td class="py-2 px-4 border-b">{employee.company}</td>
                                <td class="py-2 px-4 border-b">{employee.purchase}</td>                           
                            </tr>
                        {/each}
                    </tbody>
                </table>
            {:else}
            <table class="min-w-full rounded-lg bg-white border border-gray-300 rounded-lg shadow-md">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="py-2 px-4 border-b text-left">ID</th>
                        <th class="py-2 px-4 border-b text-left">Item Name</th>
                        <th class="py-2 px-4 border-b text-left">Created By</th>
                        <th class="py-2 px-4 border-b text-left">Company</th>
                        <th class="py-2 px-4 border-b text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {#each items as item}
                        <tr class="hover:bg-gray-100">
                            <td class="py-2 px-4 border-b">{item.id}</td>
                            <td class="py-2 px-4 border-b">{item.name}</td>
                            <td class="py-2 px-4 border-b">{item.created_by}</td>                           
                            <td class="py-2 px-4 border-b">{item.company}</td>
                            <td class="py-2 px-4 border-b">{item.description}</td>                           
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
    </div>
</div>