//This is billboard screen page to display all billboards of a store
import {format} from 'date-fns';
import {SizeClient} from "./components/client";
import {SizeColumn} from "./components/columns";
import prismadb from "@/lib/prismadb";

const SizesPage = async ({
    params
}: {
    params: {
        storeId: string;
    }
}) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSizes: SizeColumn[]  = sizes.map((item) => ({

        id: item.id,
        name: item.name,
        value: item.value,
        createAt: format(item.createdAt, 'dd MMMM yyyy - HH:mm:ss'),
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient data={formattedSizes}/>
            </div>
        </div>
    )
}

export default SizesPage;
