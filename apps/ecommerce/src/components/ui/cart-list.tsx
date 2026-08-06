import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Separator } from "@repo/ui/components/separator";
import { Button } from "@repo/ui/components/button";

export default function CartList() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleRemoveItem = (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setMessage("Item removido do carrinho!");
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      {message && (
        <div className="absolute bottom-4 right-4">
          <div className="bg-gray-900 border border-gray-800 text-gray-100 p-4 rounded-lg shadow-lg  max-w-xs transition-transform transform duration-300 ease-in-out">
            <div className="flex items-center gap-2 mt-2">
              <p>{message}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <Link
              key={index}
              href={{
                pathname: `/product/${item.nome}`,
                query: {
                  id: item.id,
                  nome: item.nome,
                  image: item.image,
                  price: item.price,
                  category: item.category,
                  description: item.description,
                  specifications: item.specifications,
                },
              }}
            >
              <div className="pt-3 pb-5 border-b border-gray-700 flex relative items-center space-x-4">
                <div>
                  <Image
                    alt={item.nome}
                    width={125}
                    height={125}
                    src={item.image}
                    className="w-full h-auto object-cover rounded-sm"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{item.nome}</h2>
                  <h3 className="text-purple text-2xl font-bold">
                    {formatCurrency(item.price)}
                  </h3>
                  <button
                    type="button"
                    className="absolute right-1 bottom-5.5 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveItem(index);
                    }}
                  >
                    <Trash className="text-danger" />
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className=" text-gray-400">
            Nenhum item adicionado no carrinho.
          </p>
        )}
      </div>

      <Separator />

      <div className="shrink-0 px-5 space-y-2 pt-4 pb-3  bg-black">
        <p className="font-semibold mb-2 text-xl">Resumo do pedido</p>
        <div className="mb-2 ">
          {cartItems.map((item, index) => (
            <p
              key={index}
              className="text-sm flex items-center justify-between text-gray-300"
            >
              {item.quantity} x {item.nome.slice(0, 40) + "..."}
              <span> {formatCurrency(item.price)}</span>
            </p>
          ))}
        </div>
        <div className="flex text-md justify-between mb-3">
          <p className="">Subtotal</p>
          <p>
            {formatCurrency(
              cartItems.reduce((total, item) => total + item.price, 0)
            )}
          </p>
        </div>
        <Button className="w-full">Finalizar compra</Button>
      </div>
    </div>
  );
}
