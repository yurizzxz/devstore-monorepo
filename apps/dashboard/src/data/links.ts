import {
    IconLayoutDashboard,
    IconPackage,
    IconUsers,
    IconSettings,
    IconBrowser,
    IconShoppingCart,
    IconFolders,
    IconTruckDelivery
  } from "@tabler/icons-react"
  
  export const navMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: IconLayoutDashboard,
    },
    {
      title: "Produtos",
      url: "/products",
      icon: IconPackage,
    },
    {
      title: "Pedidos",
      url: "/orders",
      icon: IconTruckDelivery,
    },
    {
      title: "Conteúdo do Site",
      url: "/content",
      icon: IconBrowser,
    },
    {
      title: "Usuários",
      url: "/users",
      icon: IconUsers,
    },
    {
      title: "Categorias",
      url: "/categories",
      icon: IconFolders,
    },
  ]
  
  export const navSecondary = [
    {
      title: "Configurações",
      url: "#",
      icon: IconSettings,
    },
  ]
  
  export const navUser = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }
  