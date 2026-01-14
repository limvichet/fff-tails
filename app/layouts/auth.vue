<template>
    <div>
    <LayoutThemeProvider>
        <LayoutSidebarProvider>
          <layout-admin-layout>
            <slot />
          </layout-admin-layout>
        </LayoutSidebarProvider>
    </LayoutThemeProvider>
    </div>
</template>
