"use client";

import clsx from "clsx";

export default function ScontrinoRiepilogo({ cartData }: { cartData: any }) {
  return (
    <div className="bg-[#fdfbf7] p-6 rounded-sm shadow-xl relative w-full font-mono text-sm border border-[#e8e4db]">
      <div className="absolute -top-[5px] left-0 w-full h-[6px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZmRmYmY3Ii8+PC9zdmc+')] bg-repeat-x z-10" />
      <div className="flex flex-col items-center mb-6 border-b-2 border-dashed border-[#e8e4db] pb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-800 mb-2">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
        <h4 className="font-bold text-amber-950 uppercase tracking-widest text-lg text-center leading-tight">Il tuo momento<br />di gusto ☕</h4>
        <p className="text-amber-800/60 text-[10px] mt-2 uppercase tracking-widest">TSC Caffè</p>
      </div>
      <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto no-scrollbar pr-2">
        {cartData.items.length === 0 ? (
          <p className="text-center text-amber-800/50 italic text-xs py-4">Nessun articolo selezionato.</p>
        ) : (
          cartData.items.map((item: any, idx: number) => (
            <div key={idx} className={clsx("flex justify-between items-start gap-2", item.price < 0 ? "text-emerald-700 font-bold" : "text-amber-950")}>
              <div className="flex-1 leading-tight">
                <span className="font-bold">{item.qty}x</span> <span className="opacity-90 ml-1">{item.name}</span>
              </div>
              <div className="text-right whitespace-nowrap font-medium pt-0.5">
                {(item.price * item.qty).toFixed(2)}€
              </div>
            </div>
          ))
        )}
      </div>
      <div className="border-t-2 border-dashed border-[#e8e4db] pt-4 flex justify-between items-center text-amber-950">
        <span className="font-black uppercase tracking-wider text-base">Totale</span>
        <span className="font-black text-xl">{cartData.total.toFixed(2)}€</span>
      </div>
      <div className="absolute -bottom-[5px] left-0 w-full h-[6px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZmRmYmY3Ii8+PC9zdmc+')] bg-repeat-x rotate-180 z-10" />
    </div>
  );
}