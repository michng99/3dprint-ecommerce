import {NextResponse} from "next/server";
import {auth} from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function GET (
    req: Request,
    { params }: { params: { productId: string } }
) {

    try {
        if (!params.productId) {
            return new NextResponse("Product ID is required", {status: 400});
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true
            }
        });
        return NextResponse.json(product);

    } catch (err) {
        console.log('[PRODUCT_GET]',err)
        return new NextResponse("Internal error",{status: 500});
    }
}


export async function PATCH (
    req: Request,
    { params }: {params: { storeId: string, productId: string } }
){
    try {

        const { userId } = auth();
        const body = await req.json();
        const {
            name,
            price,
            categoryId,
            sizeId,
            images,
            isFeatured,
            isArchived,
        } = body;



        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if (!images || !images.length){
            return new NextResponse("Images are required", {status: 400})
        }

        if (!price) {
            return new NextResponse("Price URL is required", {status: 400})
        }

        if (!categoryId) {
            return new NextResponse("Category URL is required", {status: 400})
        }

        if (!sizeId) {
            return new NextResponse("Size URL is required", {status: 400})
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            //Unauthorized: User doesn't have permission
            return new NextResponse("Unauthorized", {status: 403})
        }

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);

    } catch (err) {
        console.log('[PRODUCT_PATCH]',err)
        return new NextResponse("Internal error",{status: 500});
    }
};



export async function DELETE (
    req: Request,
    { params }: {params: { storeId: string, productId: string } }
){
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            //Unauthorized: User doesn't have permission
            return new NextResponse("Unauthorized", {status: 403})
        }

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            },
        });

        return NextResponse.json(product);

    } catch (err) {
        console.log('[PRODUCT_DELETE]',err)
        return new NextResponse("Internal error",{status: 500});
    }
};
