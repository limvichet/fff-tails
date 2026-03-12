<script setup lang="ts">

definePageMeta({
  layout: "default",
  guestOnly: true,
})

const route = useRoute()
const id = route.params.id

const { data } = await useFetch(`/api/admin-secure/schedules/${id}/print-schedule`)

const capital = computed(() => data.value?.capital || { organization: '', name: '' })
const loanrecord = computed(() => data.value?.loanrecord)
const schedules = computed(() => data.value?.schedules || [])
const invoice = computed(() => data.value?.invoice || {})
const sum_schedule_principle = computed(() => data.value?.sum_schedule_principle)

onMounted(()=>{
  window.print()
})

const pad = (num:number)=> String(num).padStart(8,"0")

</script>

<template>
<div class="container page-width">

<section class="content">

<!-- HEADER -->
<div class="flex gap-3 mb-4">

<img src="/imgs/logo.png" class="w-[60px] h-[60px]" />

<div>
<div class="kh-med text-lg">{{ capital.organization }}</div>
<div class="kh-med text-lg">កាលវិភាគសងប្រាក់</div>
</div>

</div>


<!-- CUSTOMER -->
<!-- <table class="table w-full">
<tbody>

<tr v-if="loanrecord">
<th class="w-[20%]">អតិថិជន</th>

<td class="w-[40%]">
{{ loanrecord?.customer?.nametitle1?.nametitle_kh }}
{{ loanrecord?.customer?.cust_name_1 }}
</td>

<td class="w-[40%]" v-if="(loanrecord?.customer as any)?.cust_name_2">
{{ loanrecord?.customer?.nametitle1?.nametitle_kh }}
{{ (loanrecord?.customer as any)?.cust_name_2 }}
</td>

</tr>


<tr v-if="loanrecord">

<th>សរុបទឹកប្រាក់</th>

<td>
{{ loanrecord?.loan_totalcash }}
{{ loanrecord?.currency?.currency_kh }}
</td>

<td>
រយៈពេលខ្ចី
{{ loanrecord?.loan_peroid }}
{{ loanrecord?.loantype?.loantype_shortcut }}
</td>

</tr>

</tbody>
</table> -->



<!-- LOAN INFO -->
<!-- <table class="table table-bordered mt-3 w-[300px]">

<tr v-if="loanrecord">
<td>លេខសម្គាល់កម្ចី</td>
<td class="text-right">{{ pad(loanrecord?.id || 0) }}</td>
</tr>

<tr v-if="loanrecord">
<td>លេខអតិថិជន</td>
<td class="text-right">{{ pad(loanrecord?.customer?.id || 0) }}</td>
</tr>

<tr v-if="loanrecord">
<td>អត្រាការប្រាក់%</td>
<td class="text-right">{{ loanrecord?.loan_interest_rate }}</td>
</tr>

</table> -->


<!-- SCHEDULE TABLE -->
<!-- <table class="table w-full mt-6">

<thead class="font-bold">
<tr>
<td>ល.រ</td>
<td>ថ្ងៃខែឆ្នាំ</td>
<td>ទូទាត់ខែ</td>
<td>ប្រាក់ដើម</td>
<td>រំលោះដើម</td>
<td>ការប្រាក់</td>
<td>សរុប</td>
<td>ប្រាក់បើកបាន</td>
<td>ប្រាក់បង់</td>
<td>ប្រាក់សល់</td>
</tr>
</thead>

<tbody>

<tr v-for="s in schedules" :key="s.id">

<td>{{ s.schedule_paymentnumber }}</td>

<td>{{ new Date(s.schedule_principle_date).toLocaleDateString() }}</td>

<td>
{{ new Date(s.schedule_principle_date).getMonth()+1 }}-
{{ new Date(s.schedule_principle_date).getFullYear() }}
</td>

<td>{{ s.schedule_outstanding }}</td>
<td>{{ s.schedule_principle }}</td>
<td>{{ s.schedule_interest }}</td>
<td>{{ s.schedule_totalpay }}</td>
<td>{{ s.schedule_totalpay }}</td>
<td>{{ s?.schedule_paidcash }}</td>
<td>{{ s?.schedule_lessmoney }}</td>

</tr>

</tbody>


<tfoot>
<tr class="font-bold border-t">
<td colspan="4" class="text-center">សរុប</td>
<td>{{ sum_schedule_principle }}</td>
<td colspan="5"></td>
</tr>
</tfoot>

</table> -->



<!-- NOTE -->
<!-- <div class="flex mt-8" v-if="loanrecord">
<div class="w-[150px]">កំណត់សម្គាល់</div>

<div>
{{ loanrecord?.loan_note || ".........................." }}
</div>
</div> -->



<!-- SIGN DATE -->
<!-- <div class="text-center mt-10">
<div>{{ invoice?.datesignChhankitek }}</div>
<div>{{ invoice?.datesignSoriyakitek }}</div>
</div> -->



<!-- SIGNATURE -->
<!-- <div class="grid grid-cols-4 mt-10 text-center">

<div>
<div>ស្នាមម្រាមដៃ</div>
<div>សាក្សី</div>
<div>............................</div>
</div>

<div v-if="loanrecord">
<div>ស្នាមម្រាមដៃ</div>
<div>អ្នកធានា</div>
<div>{{ loanrecord?.guarantor?.cust_name_1 }}</div>
</div>

<div v-if="loanrecord">
<div>ស្នាមម្រាមដៃ</div>
<div>អ្នកខ្ចីប្រាក់</div>
<div>
{{ loanrecord?.customer?.cust_name_1 }}
<span v-if="loanrecord?.customer?.cust_name_2">
{{ loanrecord?.customer?.cust_name_2 }}
</span>
</div>
</div>

<div>
<div>ស្នាមម្រាមដៃ</div>
<div>ម្ចាស់ប្រាក់</div>
<div>{{ capital.name }}</div>
</div>

</div> -->


</section>

</div>
</template>