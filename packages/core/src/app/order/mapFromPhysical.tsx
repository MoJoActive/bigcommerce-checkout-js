import { type PhysicalItem } from '@bigcommerce/checkout-sdk';

import getOrderSummaryItemImage from './getOrderSummaryItemImage';
import { type OrderItemType } from './OrderSummaryItem';

function mapFromPhysical(item: PhysicalItem): OrderItemType {
    const quantityBackordered = item.stockPosition?.quantityBackordered ?? item.quantityBackordered;
    const quantityOnHand = item.stockPosition?.quantityOnHand ?? ((quantityBackordered != null ? (item.quantity - quantityBackordered) : undefined));
    const backorderMessage = item.stockPosition?.backorderMessage || item.backorderMessage || undefined;

    return {
        id: item.id,
        quantity: item.quantity,
        amount: item.extendedComparisonPrice,
        amountAfterDiscount: item.extendedSalePrice,
        name: item.name,
        image: getOrderSummaryItemImage(item),
        description: item.giftWrapping ? item.giftWrapping.name : undefined,
        productOptions: (item.options || []).map((option) => ({
            testId: 'cart-item-product-option',
            content: `${option.name} ${option.value}`,
        })),
        quantityBackordered,
        quantityOnHand,
        backorderMessage,
    };
}

export default mapFromPhysical;
