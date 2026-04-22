<script setup lang="ts">
const props = defineProps<{
  data: any
}>()

// helpers (replace PHP UnicodeHelper)
function khNumber(val: any) {
  if (!val) return ''
  return val.toString()
    .replace(/0/g, '០')
    .replace(/1/g, '១')
    .replace(/2/g, '២')
    .replace(/3/g, '៣')
    .replace(/4/g, '៤')
    .replace(/5/g, '៥')
    .replace(/6/g, '៦')
    .replace(/7/g, '៧')
    .replace(/8/g, '៨')
    .replace(/9/g, '៩')
}

function formatMoney(val: any) {
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function formatDate(date: string) {
  if (!date) return ''
  const d = new Date(date)
  return `${khNumber(d.getDate())}/${khNumber(d.getMonth()+1)}/${khNumber(d.getFullYear())}`
}
</script>


<template>
  <div class="wrapper">
    <table>

      <!-- HEADER -->
      <tr>
        <td style="text-align:center; width:25%">
          <img src="/imgs/logo.png" class="logo" />
          <h4>{{ data.capital.organization }}</h4>
        </td>

        <td style="width:50%">
          <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
          <h1>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1>
          <h1 class="tacteng">3</h1>
          <h2>កិច្ចសន្យាខ្ចីប្រាក់បង់រំលោះ</h2>
        </td>

        <td style="width:25%"></td>
      </tr>

      <!-- CONTENT -->
      <tr>
        <td colspan="3">
          <p>
            លោកស្រី<strong>{{ data.capital.name }}</strong>
            កើតឆ្នាំ {{ khNumber(data.capital.birth_year) }}
          </p>
        </td>
      </tr>

      <!-- CUSTOMER -->
      <tr>
        <td colspan="3">
          <p>
            {{ data.loanrecord.customer.nametitle1?.nametitle_kh }}
            <strong>{{ data.loanrecord.customer.cust_name_1 }}</strong>
          </p>
        </td>
      </tr>

      <!-- AMOUNT -->
      <tr>
        <td colspan="3">
          <p>
            ប្រាក់សរុប:
            <b>
              {{ khNumber(formatMoney(data.loan2.contract_schedule_totalpay_all)) }}
              {{ data.loanrecord.currency.currency_kh }}
            </b>
          </p>
        </td>
      </tr>

      <!-- CHEQUES LOOP -->
      <tr v-for="(c, i) in data.loan_cheques" :key="c.id">
        <td colspan="3">
          <p>
            {{ i  }}.
            លេខ {{ khNumber(c.cheque_number) }}
            ថ្ងៃទី {{ formatDate(c.schedule_cheque_to_date) }}
            ចំនួន {{ khNumber(c.schedule_totalpay) }}
          </p>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td colspan="3" class="center">
          <p><b>{{ data.invoice.datesignChhankitek }}</b></p>
          <p><b>{{ data.invoice.datesignSoriyakitek }}</b></p>
        </td>
      </tr>

    </table>
  </div>
</template>