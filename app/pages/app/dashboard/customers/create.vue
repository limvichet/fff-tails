
<script setup>
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import DefaultInputs from '@/components/forms/FormElements/DefaultInputs.vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import SelectInput from '@/components/forms/FormElements/SelectInput.vue'
import InputState from '@/components/forms/FormElements/InputState.vue'
import TextArea from '@/components/forms/FormElements/TextArea.vue'
import InputGroup from '@/components/forms/FormElements/InputGroup.vue'
import Dropzone from '@/components/forms/FormElements/Dropzone.vue'
import FileInput from '@/components/forms/FormElements/FileInput.vue'
import CheckboxInput from '@/components/forms/FormElements/CheckboxInput.vue'
import DropzoneImage from '~/components/forms/FormElements/DropzoneImage.vue'



  definePageMeta({
    layout: "auth",
    requiresAuth: true,
    // guestOnly: true,
    // path: '/app/dashboard',
    //requiresAuth: true,
    // Pass the breadcrumb data here
    breadcrumb: {
      title: 'Customers',
      subTitle: 'Create'
    }
  });

  useFFFSeo({
    title: `${defaultSeo.title} - Customer Create`,
    description:
      "This is your dashboard where you can manage many things about your account!",
  });


</script>

<template>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div class="space-y-6">
        <ComponentCard title="1. Basic">
          <DefaultInputs />
        </ComponentCard>
        <ComponentCard title="Select Inputs">
          <SelectInput />
        </ComponentCard>
        <ComponentCard title="Inputs States">
          <TextArea />
        </ComponentCard>
        <ComponentCard title="Inputs States">
          <InputState />
        </ComponentCard>
      </div>
      <div class="space-y-6">
        <ComponentCard title="2. Basic"> <InputGroup /> </ComponentCard>
        <ComponentCard title="File Input"> <FileInput /> </ComponentCard>
        <ComponentCard title="Checkboxes">
          <CheckboxInput />
        </ComponentCard>
        <ComponentCard title="Dropzone">
          <DropzoneImage />
        </ComponentCard>
      </div>
    </div>

</template>

