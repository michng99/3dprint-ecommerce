//This is billboard screen page to display all billboards of a store
import {format} from 'date-fns';
import {ProductClient} from "./components/client";
import {ProductColumn} from "./components/columns";
import prismadb from "@/lib/prismadb";
import {formatter} from "@/lib/utils";

const ProductsPage = async ({
    params
}: {
    params: {
        storeId: string;
    }
}) => {
    const products = await prismadb.product.findMany(({
        where: {
            storeId: params.storeId
        },
        include:{
            category: true,
            size: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    }));

    const formattedProducts: ProductColumn[]  = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        createdAt: format(item.createdAt, 'dd MMMM yyyy - HH:mm:ss'),
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    )
}

export default ProductsPage;
