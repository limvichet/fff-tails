<script setup lang="ts">

  definePageMeta({
    layout: "print",
    requiresAuth: false,
    ssr: false
  })

  useHead({
    title: "Preview contract2",
    meta: [{ name: "Loan", content: "preview contract2" }],
  })

  const props = defineProps<{
    dd: any,
    loading: boolean
  }>()

  import { numUnicode, formatNumber } from "~/utils/number"
  import { formatFullDate, formatYear, formatDayOnly } from "~/utils/date"
  import { UnicodeHelper } from '~/utils/unicodeHelper'


  // const dd = ref<PrintReceipt2 | null>(null)
  const capital = computed(() => props.dd!.capital ?? null)
  const loanrecord = computed(() => props.dd!.loanrecord ?? null)
  const loan2 = computed(() => props.dd!.loan2 ?? null)
  const loan_cheques = computed(() => props.dd!.loan_cheques ?? null)
  const invoice = computed(() => props.dd!.invoice ?? null)



  onMounted(async () => {
    await waitImageLoad()
    // setTimeout(() => window.print(), 300)
  })

  const logoRef = ref<HTMLImageElement | null>(null)
  const waitImageLoad = () => {
    return new Promise<void>((resolve) => {
      if (!logoRef.value) return resolve()

      if (logoRef.value.complete) {
        resolve() // already loaded
      } else {
        logoRef.value.onload = () => resolve()
        logoRef.value.onerror = () => resolve() // avoid blocking
      }
    })
  }
  
</script>


<template>

  <div v-if="loading" class="loading"><p>Preparing Document ...</p></div>
  <div v-else-if="!dd">No Data ...</div>

  <div v-if="!loading && dd" class="page">

        <!-- HEADER -->
    <header class="row between center">

      <div class="colo-2" style="margin-top: 5px; margin-left: -10px; display: flex; flex-direction: column; align-items: center;">
          <img ref="logoRef" src="/imgs/logo.png" class="logo" />
          <h6>{{ capital!.organization }}</h6>
      </div>

      <div class="center">
        <h1>ព្រះរាជាណាចក្រកម្ពុជា</h1>
        <h1>ជាតិ សាសនា ព្រះមហាក្សត្រ</h1>
        <p class="tacteng">3</p>
        <h2>កិច្ចសន្យាខ្ចីប្រាក់បង់រំលោះ</h2>
        <h3 class="fs-13 mt bold">បញ្ចាំមូលប្បទានប័ត្រ</h3>
      </div>

      <div class="col-1" ></div>

    </header>

    <main class="mt">

           <!-- ភាគី ក -->
          <p class="justify inden">
            លោកស្រី <span class="muol fs-11">{{ capital.name }}</span> កើតឆ្នាំ {{ numUnicode(capital.birth_year) }}
            កាន់អត្តសញ្ញាណប័ណ្ណសញ្ចាតិខ្មែរលេខ១៥០៩៧៧៨៨៩ ចុះថ្ងៃទី ២៥/១២/២០២០ មានទីលំនៅស្ថិតនៅភូមិកំពង់ក្របៅ
            សង្កាត់កំពង់ក្របៅ ក្រុងស្ទឹងសែន ខេត្តកំពង់ធំ ជាអ្នកឲ្យខ្ចី<span class="muol fs-10">(ម្ចាស់បំណុល)</span>
            តទៅហៅកាត់ថា <span class="muol fs-10">ភាគី “ក”</span> ។
          </p>

           <!-- និង -->
          <h2 class="center mt">និង</h2>

          <!-- ភាគី ខ -->
          <section>
            <p class="justify inden">
              {{ loanrecord!.customer.nametitle1?.nametitle_kh }} <span class="muol fs-10">{{ loanrecord.customer.cust_name_1 }}</span> កើតឆ្នាំ{{ numUnicode(formatYear(loanrecord!.customer.cust_dob_1)) }}
              កាន់អត្តសញ្ញាណប័ណ្ណសញ្ចាតិខ្មែរលេខ{{ numUnicode(loanrecord.customer.cust_idcardnum_1) }} ចុះ{{ formatFullDate(loanrecord.customer.cust_idcardnum_date_1) }}
              មានអាសយដ្ឋានស្ថិតនៅ{{ dd.loanrecord.customer.cust_address }} ជាអ្នកខ្ចីប្រាក់<span class="muol fs-10">(កូនបំណុល)</span> តទៅហៅកាត់ថា <span class="muol fs-10">ភាគី “ខ”</span> ។
            </p>
          </section>

          <p class="justify inden muol fs-10">ក្រោយពីបានពិភាក្សាគា្នយ៉ាងល្អិតល្អន់រួចមក ភាគីទាំងពីរបានព្រមពៀងគ្នាដូចខាងក្រោមៈ</p>
         
          <!-- ប្រការ១ -->
          <section>
            <p class="mt muol fs-10">ប្រការ១_អំពីប្រាក់ដើម  និងអំឡុងពេល</p>
            <p class="justify inden margin-l-40">
              ភាគី “ក” យល់ព្រមឲ្យភាគី “ខ”  ខ្ចីប្រាក់ចំនួន 
              <b>{{numUnicode(formatNumber(loan2.contract_schedule_totalpay_all))}}{{ loanrecord.currency.currency_kh }}
              ({{UnicodeHelper.spellkhmer(loan2.contract_schedule_totalpay_all)}}{{loanrecord.currency.currency_kh}}គត់)</b>
              ដោយមិនគិតការប្រាក់ហើយភាគី “ខ”  ស្នើសុំបង់រំលោះសម្រាប់រយៈពេលចំនួន<b>{{ numUnicode(loanrecord.loan_peroid) }}{{ loanrecord.loantype.loantype_shortcut }}</b> 
              ក្នុង១ខែចំនួន <b>{{ numUnicode(formatNumber(loan2.contract_schedule_totalpay_first))}}{{loanrecord.currency.currency_kh }}
              ({{UnicodeHelper.spellkhmer(loan2.contract_schedule_totalpay_first)}}{{loanrecord.currency.currency_kh}}គត់)</b> គិតចាប់ពី<b>{{ formatFullDate(loan2.contract_schedule_totalpay_first_date) }}
              ដល់{{formatFullDate(loan2['contract_schedule_totalpay_last_date']) }}</b>
              ហើយភាគី “ខ”  យល់ព្រមបង់រំលោះប្រាក់ដើម
              <b>យ៉ាងយូរ{{ formatDayOnly(loan2.contract_schedule_first_paid_date) }}</b>
              រៀងរាល់ខែ<b>ជាថ្ងៃកំណត់នៃការបង់រំលោះប្រាក់ដើម</b>ដោយមិនអាចឲ្យខកខានបានឡើយ។
              ចំពោះទឹកប្រាក់ដើមដែលនៅសល់ចំនួន <b>{{numUnicode(formatNumber(loan2.contract_schedule_totalpay_last))}}{{ loanrecord.currency.currency_kh }}
              ({{UnicodeHelper.spellkhmer(loan2.contract_schedule_totalpay_last)}}{{loanrecord.currency.currency_kh}}គត់)</b>
              ភាគី “ខ” សន្យាបង់នៅ<b>{{ formatFullDate(loan2.contract_schedule_totalpay_last_date) }}</b>ជាកំហិត។
            </p>
          </section>

          <!-- ប្រការ២ -->
           <section>
            <p class="justify inden margin-l-40">
              ចំពោះប្រាក់ដើមចំនួន <b>{{numUnicode(formatNumber(loan2.contract_schedule_totalpay_all))}}{{ loanrecord.currency.currency_kh }}
              ({{UnicodeHelper.spellkhmer(loan2.contract_schedule_totalpay_all)}}{{loanrecord.currency.currency_kh}}គត់)</b>
              ភាគី “ខ” ត្រូវសងរំលោះជូនភាគី “ក” ទៅតាមប្រការ១ ជារៀងរាល់ខែក្នុងមួយខែចំនួន <b>{{numUnicode(formatNumber(loan2.contract_schedule_totalpay_first))}}{{ loanrecord.currency.currency_kh }}
              ({{UnicodeHelper.spellkhmer(loan2.contract_schedule_totalpay_first)}}{{loanrecord.currency.currency_kh}}គត់)</b>
              ហើយចំពោះប្រាក់ដែលនៅសល់ចំនួន <b>{{numUnicode(formatNumber(loan2.contract_schedule_totalpay_last))}}{{ loanrecord.currency.currency_kh }}
              ({{UnicodeHelper.spellkhmer(loan2.contract_schedule_totalpay_last)}}{{loanrecord.currency.currency_kh}}គត់)</b>
              ដូចក្នុងប្រការ១ ត្រូវសងផ្ដាច់នៅ<b>{{ formatFullDate(loan2['contract_schedule_totalpay_last_date']) }}</b>
              និងចេញមូលប្បទានប័ត្រ ធនាគារ{{ loan2.bank }}<b>ចំនួន៤សន្លឹក</b> សម្រាប់ធានាឲ្យការបង់រំលោះប្រចាំខែនីមួយៗ៖
            </p>
            
            <!-- cheques -->
            <div v-if="loan_cheques.length > 0">
              <!-- 1 -->
              <p class="justify margin-l-80 inden--"><b>១. </b>
                មូលប្បទានប័ត្រធនាគារ{{ loan2.bank }}លេខ<b>{{ numUnicode(loan_cheques[0].cheque_number) }}</b>
                ចុះ{{ formatFullDate(loan_cheques[0].schedule_cheque_to_date) }}
                មានទឹកប្រាក់ចំនួន <b>{{ numUnicode(formatNumber(loan_cheques[0].schedule_totalpay)) }}{{
                  loanrecord.currency.currency_kh }}
                  ({{ UnicodeHelper.spellkhmer(loan_cheques[0].schedule_totalpay) }}{{ loanrecord.currency.currency_kh
                  }}គត់)
                  ទុកសម្រាប់ទូទាត់លើប្រាក់ដើមដោយគិតចាប់ពី{{ formatFullDate(loan_cheques[0].schedule_cheque_from_date) }}
                  ដល់{{ formatFullDate(loan_cheques[0].schedule_cheque_to_date) }}</b>
                ដូចមានក្នុងប្រការ១។
              </p>
              <!-- 2-->
              <p class="justify margin-l-80 inden--"><b>២. </b>
                មូលប្បទានប័ត្រធនាគារ{{ loan2.bank }}លេខ<b>{{ numUnicode(loan_cheques[1].cheque_number) }}</b>
                ចុះ{{ formatFullDate(loan_cheques[1].schedule_cheque_to_date) }}
                មានទឹកប្រាក់ចំនួន <b>{{ numUnicode(formatNumber(loan_cheques[1].schedule_totalpay)) }}{{
                  loanrecord.currency.currency_kh }}
                  ({{ UnicodeHelper.spellkhmer(loan_cheques[1].schedule_totalpay) }}{{ loanrecord.currency.currency_kh
                  }}គត់)
                  ទុកសម្រាប់ទូទាត់លើប្រាក់ដើមដោយគិតចាប់ពី{{ formatFullDate(loan_cheques[1].schedule_cheque_from_date) }}
                  ដល់{{ formatFullDate(loan_cheques[1].schedule_cheque_to_date) }}</b>
                ដូចមានក្នុងប្រការ១។
              </p>
              <!-- 3-->
              <p class="justify margin-l-80 inden--"><b>៣. </b>
                មូលប្បទានប័ត្រធនាគារ{{ loan2.bank }}លេខ<b>{{ numUnicode(loan_cheques[2].cheque_number) }}</b>
                ចុះ{{ formatFullDate(loan_cheques[2].schedule_cheque_to_date) }}
                មានទឹកប្រាក់ចំនួន <b>{{ numUnicode(formatNumber(loan_cheques[2].schedule_totalpay)) }}{{
                  loanrecord.currency.currency_kh }}
                  ({{ UnicodeHelper.spellkhmer(loan_cheques[2].schedule_totalpay) }}{{ loanrecord.currency.currency_kh
                  }}គត់)
                  ទុកសម្រាប់ទូទាត់លើប្រាក់ដើមដោយគិតចាប់ពី{{ formatFullDate(loan_cheques[2].schedule_cheque_from_date) }}
                  ដល់{{ formatFullDate(loan_cheques[2].schedule_cheque_to_date) }}</b>
                ដូចមានក្នុងប្រការ១។
              </p>
              <!-- 4-->
              <p class="justify margin-l-80 inden--"><b>៤. </b>
                មូលប្បទានប័ត្រធនាគារ{{ loan2.bank }}លេខ<b>{{ numUnicode(loan_cheques[3].cheque_number) }}</b>
                ចុះ{{ formatFullDate(loan_cheques[3].schedule_cheque_to_date) }}
                មានទឹកប្រាក់ចំនួន <b>{{ numUnicode(formatNumber(loan_cheques[3].schedule_totalpay)) }}{{
                  loanrecord.currency.currency_kh }}
                  ({{ UnicodeHelper.spellkhmer(loan_cheques[3].schedule_totalpay) }}{{ loanrecord.currency.currency_kh
                  }}គត់)</b>
                មូលប្បទានប័ត្រនេះទុកសម្រាប់ធានាលើការអនុវត្តកាតព្វកិច្ចបង់ប្រាក់ដើមរបស់ភាគី “ខ” ដែលបានខ្ចីពីភាគី “ក”
                ដូចមានមានក្នុងប្រការ១ និងប្រការ២ និងមានសិទ្ធិចាត់ចែងប្រើប្រាស់ និងអាស្រ័យផលលើមូលប្បទានប័ត្រនេះដូចប្រការ២
                ដោយឥតមានការតវ៉ា ប៉ុន្ដែមូលប្បទានប័ត្រនេះមិនអាចអនុវត្តបានទេក្នុងករណីភាគី “ខ”
                បានអនុវត្តការសងគ្រប់ចំនួនដូចក្នុងប្រការ១ និងប្រការ២ ចប់រួចរាល់។ តែបើភាគី “ខ” អនុវត្តដូចក្នុងប្រការ១
                និងប្រការ២ ហើយមូលប្បទានប័ត្រនេះត្រូវទុកជាមោឃៈ។
              </p>
            </div>
          </section>

          <!-- ប្រការ៣-->
          <section>
            <p class="mt muol fs-10">ប្រការ៣_</p>
            <p class="justify inden margin-l-40">
              ភាគី “ខ” ព្រមដាក់ធានាមូលប្បទានប័ត្រធនាគារ{{ loan2.bank }}<b>ចំនួន៣សន្លឹក</b> សម្រាប់ទូទាត់ការបង់រំលោះប្រចាំខែ <b>ហើយ១សន្លឹក</b>ទៀតសម្រាប់ធានាឲ្យការមិនអនុវត្តកាតព្វកិច្ចដែលរហូតដល់សងប្រាក់អស់ដូចក្នុងប្រការ១ ដោយមូលប្បទានប័ត្រនេះចេញឡើងក្នុងគោលបំណងទូទាត់ប្រាក់ប្រចាំថ្ងៃតែប៉ុណ្ណោះ    មូលប្បទានប័ត្រទី៤ ដូចប្រការ២នេះអនុវត្តបានលុះត្រាតែភាគី “ខ”  មិនបានអនុវត្តសងប្រាក់ឲ្យបានត្រឹមត្រូវដូចប្រការ១។
            </p>
          </section>

          <!-- ប្រការ៤-->
          <section>
            <p class="mt muol fs-10">ប្រការ៤_</p>
            <p class="justify inden margin-l-40">
              មូលប្បទានប័ត្រទាំង៤ សន្លឹកដូចក្នុងប្រការ២ ដែលចេញដោយ <b>{{loanrecord.customer.cust_name_1 }}</b>
              ភាគី ខ បានព្រមព្រៀងទទួលខុសត្រូវតាមផ្លូវច្បាប់លើការចេញមូលប្បទានប័ត្រធនាគារនេះ។ 
            </p>
          </section>

          <!-- ប្រការ៥-->
          <section>
            <p class="mt muol fs-10">ប្រការ៥_</p>
            <p class="justify inden margin-l-40">
              ភាគីខ ត្រូវចេញថ្លៃសេវាមេធាវី នូវចំនួនទឹកប្រាក់  <b>USD២០០ (ពីររយដុល្លារអាមេរិច)</b> ។
            </p>
          </section>

          <!-- ប្រការ៦-->
          <section>
          <p class="mt muol fs-10">ប្រការ៦_ការដាក់ប្រាតិភោគ</p>
          <p class="justify inden margin-l-40">
            <p v-if="loanrecord.loan_collateral_1">- {{ loanrecord.loan_collateral_1 }}</p>
            <p v-if="loanrecord.loan_collateral_2">-{{ loanrecord.loan_collateral_2 }}</p>
          </p>
          </section>

          <!-- ប្រការ៧-->
          <section>
            <p class="mt muol fs-10">ប្រការ៧_ល័ក្ខខ័ណ្ឌពិសេស</p>
            <p class="justify inden margin-l-40">
                ដើម្បីជាការទុកចិត្ត និងការគោរពនូវប្រាក់ដែល ភាគី“ខ” បានខ្ចីពី ភាគី“ក” នោះភាគី“ខ” យល់ព្រម និងឯកភាពធ្វើលិខិតទិញ-លក់ផ្តាច់ និងផ្តិតមេដៃលើអាក់(ទម្រង់សុរិយោដី) និងផ្ទេរសិទ្ធិទៅលើអចលនវត្ថុដែលមានចែងក្នុងប្រការ៥មកឲ្យភាគី“ក” ជាម្ចាស់កម្មសិទ្ធិករហើយឯកសារទាំងនោះត្រូវបានតម្កល់ទុកនៅភាគី“ក”។ នៅពេលដែលភាគី“ខ” មិនបានបង់ប្រាក់តាមការសន្យា ដូចមានចែងក្នុងប្រការ៦ និងប្រកាស២នោះ ភាគី“ខ” យល់ព្រមលក់ផ្ដាច់ដីដែលបានដាក់បញ្ចាំក្នុងប្រការ៦ មកឲ្យភាគី“ខ” ក្នុងតម្លៃជំពាក់ដែលនៅសល់។
            </p>
          </section>

          <!-- ប្រការ៨-->
          <section>
            <p class="mt muol fs-10">ប្រការ៨_</p>
            <p class="justify inden margin-l-40">
              នៅពេលភាគី “ខ”  បានបង់ប្រាក់បានគ្រប់ចំនួន និងទៀងទាត់ដល់ថ្ងៃកំណត់នីមួយៗនៃមូលប្បទានប័ត្រដូចមានក្នុងប្រការ២ ជារៀងរាល់ថ្ងៃភាគី “ក”    ត្រូវប្រគល់មូលប្បទានប័ត្រធនាគារ{{ loan2.bank }}១សន្លឹកនោះឲ្យទៅភាគី “ខ”  ដើម្បីបំផ្លាញចោល ហើយបន្ដសកម្មភាពនេះបន្ដរហូតដល់ពេលដែលភាគី “ខ”  សងប្រាក់បានគ្រប់ចំនួននៃប្រាក់ដើមដូចមានក្នុងប្រការ១ រហូតដល់អស់សន្លឹកមូលប្បទានប័ត្រទាំង៣សន្លឹកនោះ។ 
            </p>
          </section>

          <!-- ប្រការ៩-->
          <section>
            <p class="mt muol fs-10">ប្រការ៩_ប្រាក់ពិន័យចំពោះការយឺតយ៉ាវ</p>
            <p class="justify inden-- margin-l-80">បើមានការយឺតយ៉ាវក្នុងការបង់ការប្រាក់ភាគី “ខ” យល់ព្រមអោយភាគី “ក” ពិន័យដូចតទៅៈ</p>
                <p class=" justify inden-- margin-l-80"><b>១. </b>លើសកំណត់១៥ថ្ងៃ ត្រូវពិន័យ៥%ក្នុងមួយថ្ងៃ នៃប្រាក់ដើមសរុប។
            </p>
            <p class="justify inden-- margin-l-80"><b>២.	</b>លើសកំណត់២៥ថ្ងៃ ត្រូវពិន័យ១០% ក្នុងមួយថ្ងៃ នៃប្រាក់ដើមសរុប។</p>
                <p class=" justify inden-- margin-l-80"><b>៣. </b>
              ក្នុងករណីលើសពី៣ថ្ងៃ ហើយភាគី “ខ” អាក់ខានក្នុងការបង់ប្រាក់ដូចមានក្នុងប្រការ១ ចំនួន១៥ថ្ងៃ
              លុយដែលត្រូវបង់ពីមុននឹងចាត់ទុកជាមោឃៈហើយប្រយោជន៍ត្រូវបានទៅភាគី “ក” ដោយត្រូវចាត់ទុកថាភាគី“ខ”
              នៅជំពាក់ប្រាក់ចំនួន <b>{{ numUnicode(formatNumber(loan2.contract_schedule_totalpay_all)) }}{{
                loanrecord.currency.currency_kh }}
                ({{ numUnicode(formatNumber(loan2.contract_schedule_totalpay_all))
                }}{{ loanrecord.currency.currency_kh }}គត់)</b>
              ដដែលព្រមទាំងភាគី“ខ” សុខចិត្តឲ្យភាគី“ក”
              ប្ដឹងទៅតុលាការដើម្បីអនុវត្តទៅតាមផ្លូវច្បាប់ដើម្បីទាមទារសំណងនៃការខូចខាតផ្សេងៗចំនួន
              ៣០,០០០$(សាមសិបពាន់ដុល្លាអាមេរិច) និងទាមទារសំណងការខូតខាតក្នុងមួយឆ្នាំ២៥%(ភាគរយ)។ ក្នុងករណីលើសរយៈពេល១០ថ្ងៃ
              ភាគី“ខ” មិនអាចបង់រំលោះសងអស់ទឹកប្រាក់ដូចក្នុងប្រការ១ បានភាគី“ក” និងភាគី“ខ”
              ព្រមព្រៀងគ្នាត្រូវធ្វើកិច្ចសន្យាថ្មីមួយទៀត។
            </p>
            <p class="justify inden-- margin-l-80"><b>៤.	</b>ក្នុងករណីភាគី “ខ” មិនបានបំពេញកាតព្វកិច្ចសងប្រាក់ឲ្យបានគ្រប់ចំនួនជូនភាគី“ក” ភាគី“ក” មានសិទ្ធិគិតការប្រាក់ចំនួន១.៥ភាគរយលើប្រាក់ដើមដែលនៅលើភាគី“ខ” ហើយភាគី“ខ” បានឯកភាពខ្ចីប្រាក់ដូចក្នុងប្រការ១ ។</p>
          </section>

          <!-- ប្រការ១០-->
          <section>
          <p class=" mt muol fs-10">ប្រការ១០_</p>
          <p class="justify inden margin-l-40">
            កិច្ចសន្យានេះត្រូវបង្កើតកាតព្វកិច្ចដល់ទាយាទភាគីទាំងពីរ ហើយក្នុងករណីដែលភាគីណាមួយពុំអនុវត្តកាតព្វកិច្ចតាមការសន្យាដូចមានចែងក្នុងប្រការនីមួយៗនៃកិច្ចព្រមព្រៀងនេះ ត្រូវទទួលខុសត្រូវតាមផ្លូវច្បាប់។ រាល់ការប្រគល់ទទួលប្រាក់ភាគី“ក” និងភាគី“ខ” ត្រូវធ្វើលិខិតប្រគល់ ទទួលប្រាក់ជាលាយលក្ខណ៍អក្សរ។
          </p>
          </section>

          <!-- ប្រការ១១-->
          <section>
            <p class="mt muol fs-10">ប្រការ១១_ច្បាប់ដែលមានសមត្ថកិច្ច</p>
            <p class="justify inden-- margin-l-80"><b>១. </b>គូភាគីត្រូវប្រកាន់ឈរលើគោលការណ៍សម្រុះសម្រួលគ្នា
              ពិភាក្សាឈរលើគោលការណ៍យោគយល់គ្នាជាមុនសិនក្នុងករណីមិនសះជា
              ជាសមត្ថកិច្ចរបស់តុលាការគ្រប់ជាន់ថ្នាក់នៃព្រះរាជាណាចក្រកម្ពុជា ឬនៅទីកន្លែងអនុវត្តកិច្ចព្រមព្រៀង។</p>
            <p class="justify inden-- margin-l-80"><b>២. </b>កិច្ចសន្យានេះគ្របដណ្តប់ដោយច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា។</p>
            <p class=" justify inden-- margin-l-80"><b>៣.
              </b>កិច្ចព្រមព្រៀងនេះត្រូវបានធ្វើឡើងដោយគ្មានការបង្ខិតបង្ខំពីភាគីណាមួយឡើយ ហើយភាគីទាំងអស់បានមើលបានអាន បានស្ដាប់
              និងយល់នូវរាល់ខ្លឹមសារទាំងឡាយគ្រប់ប្រការខាងលើនៃកិច្ចសន្យានេះច្បាស់លាស់ ហើយយល់ព្រមផ្ដិតមេដៃស្ដាំទុកជាភស្ដុតាង។
            </p>
            <p class="justify inden-- margin-l-80"><b>៤.
              </b>កិច្ចសន្យានេះមានប្រសិទ្ធិភាពអនុវត្តចាប់ពីថ្ងៃផ្ដិតមេដៃស្ដាំនេះតទៅ។</p>
            <p class=" justify inden-- margin-l-80">កិច្ចព្រមព្រៀងនេះត្រូវបានធ្វើឡើងជា០៣ច្បាប់ជាភាសាខ្មែរ
              មានតម្លៃស្មើគ្នារក្សាទុកនៅភាគីនីមួយៗចំនួន០១ច្បាប់ និងរក្សាទុកនៅក្រុមហ៊ុនមេធាវី០១ច្បាប់ទុកជាភស្តុតាង។</p>
          </section>


    </main>


    <footer class="mt bold center">

      <div>
        <p>{{ invoice!.datesignChhankitek }}</p>
        <p>ធ្វើនៅកំពង់ធំ {{ invoice!.datesignSoriyakitek }}</p>
      </div>

      <!-- SIGNATURE GRID -->
      <div class="row between mt">
        <div></div>
        <!-- CAPITAL -->
        <div>
          <span>ស្នាមមេដៃស្ដាំភាគី"ក”</span>
          <div class="v-space"></div>
          <span>{{ capital!.name }}</span>
        </div>

        <!-- cust_name_1 -->
        <div>
          <span>ស្នាមមេដៃស្ដាំភាគី"ខ”</span>
          <div class="v-space"></div>
          <span>{{ loanrecord!.customer.cust_name_1 }}</span>
        </div>
        <div></div>
      </div>

      <div class="mt">
        <p>បានឃើញ</p>
        <p>ហត្ថលេខា និងត្រា</p>
      </div>

    </footer>

   
  </div>
</template>