const db={
    methods:{
        find:(id)=>{
            return db.items.find(item=> item.id==id);
        },
        remove: (items)=>{
            items.forEach(item => {
                const product =db.methods.find(item.id);
                product.qty=product.qty-item.qty;
            });
            
        }

    },
    items: [
        {
            id:0,
            title:"Kunfo Pop",
            price:250,
            qty:5
        },
        {
            id:1,
            title:"Harry Potter",
            price:345,
            qty:50
        },
        {
            id:2,
            title:"Phillips Hue",
            price:1300,
            qty:80
        },
        {
            id:3,
            title:"iPhone x pro",
            price:6000,
            qty:8
        }
    ]
};

const shoppingCart={
    items:[],
    methods:{
        add:(id,qty)=>{
            const cartItem=shoppingCart.methods.get(id);
            if (cartItem){
                if(shoppingCart.methods.hasInventory(id,qty +cartItem.qty)){
                    cartItem.qty+=qty;
                }
                else{
                    alert("No hay inventario");
                }
            }else
            {
                shoppingCart.items.push({id,qty});
            }
        },
        remove:(id,qty)=>{
            const cartItem=shoppingCart.methods.get(id);
            if(cartItem.qty-qty>0){
                cartItem.qty-=qty;
            }else{
                shoppingCart.items=shoppingCart.items.filter(item=> item.id!==id);
            }
        },
        count:()=>{
            return shoppingCart.items.reduce((acc,item)=>acc+item.qty,0);
        },
        get:(id)=>{
            const index=shoppingCart.items.findIndex(item => item.id==id);
            return index>=0?shoppingCart.items[index]:null;

        },
        getTotal:()=>{
            const total=shoppingCart.items.reduce((acc,item)=>{
                const found=db.methods.find(item.id);
                return acc+found.price*item.qty;

            },0);
            return total;
        },
        hasInventory:(id,qty)=>{
            return db.items.find(item => item.id==id).qty-qty>=0;
           
        },
        purchase:()=>{
            db.methods.remove(shoppingCart.items);
            shoppingCart.items=[];
        }
    }

};

const shoppingContainer=document.querySelector("#shopping-cart-container");
renderStore();

function renderStore(){
    
    const html=db.items.map((item) =>{
        return `<div class="item">
        <div class="title">${item.title}</div>
        <div class="price">${numberToCurrency(item.price)}</div>
        <div class="qty">${item.qty}</div>

        <div class="actions">
            <button class="add" data-id="${item.id}">Add to Shopping Cart</button>
        </div>
    </div>`;
    });

    document.querySelector(".store-container").innerHTML=html.join("");
    document.querySelectorAll(".item .actions .add").forEach(btn=> {
        btn.addEventListener("click",ele =>{
            const id=parseInt(btn.getAttribute("data-id"));
            const item=db.methods.find(id);

            if(item && item.qty-1>0){
                // anhadimos al shopping card

                shoppingCart.methods.add(id,1);
                shoppingContainer.classList.add("show");
                shoppingContainer.classList.remove("hide");

                renderShoppingCart();
                
            }
            else{
                console.log('No hay inventario');
            }
        });
    })
}

function renderShoppingCart(){
    const html=shoppingCart.items.map(item =>{
        const dbItem=db.methods.find(item.id);
        return `
        <div class="cartItem">
            <div class="itemTitle">${dbItem.title}</div>
            <div class="itemPrice">${numberToCurrency(dbItem.price)}</div>
            <div class="itemQty">${item.qty}</div>
            <div class="subTotal">Subtotal:"${numberToCurrency(item.qty*dbItem.price)}"</div>
            <div class="actions">
                <button class="addOne" data-id="${item.id}">+</button>
                <button class="removeOne" data-id="${item.id}">-</button>
            </div>
        </div>`;
        
    });
   

const closeButton=`<div class="cart-header">
<button class="bClose">X</button>
</div>`;

const purchaseButton=shoppingCart.items.length>0?`
<div class="cart-actions">
<button id="bPurchase">Terminar Compra</button>
</div>`:"";

const Total=shoppingCart.methods.getTotal();

const totalContainer=`
<div class="total">Total: ${numberToCurrency(Total)}</div>
`;


shoppingContainer.innerHTML=closeButton+html.join("")+totalContainer+purchaseButton;


document.querySelectorAll(".addOne").forEach(btn=>{
    btn.addEventListener("click",e =>{
        id =parseInt(btn.getAttribute("data-id"));
        shoppingCart.methods.add(id,1);
        renderShoppingCart();
    });
});

document.querySelectorAll(".removeOne").forEach(btn=>{
    btn.addEventListener("click",e =>{
        const id=parseInt(btn.getAttribute('data-id'));
        shoppingCart.methods.remove(id,1);
        renderShoppingCart();
    });
});

document.querySelector(".bClose").addEventListener("click",e =>{
    shoppingContainer.classList.add('hide');
    shoppingContainer.classList.remove('show');
});

const btnPurchase=document.querySelector("#bPurchase");
console.log(btnPurchase);
if (btnPurchase){
    btnPurchase.addEventListener("click",e=>{
        shoppingCart.methods.purchase();
        renderStore();
        renderShoppingCart();
    });
}

};





function numberToCurrency(num){
    return new Intl.NumberFormat(
        "en-US",{maximumSignificantDigits:2,style:"currency",currency: "USD"}
    ).format(num);
}


