/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
    const discount = 1 - (purchase.discount / 100);
    return purchase.sale_price * purchase.quantity * discount;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
    const max_bonus = 0.15;
    const high_bonus = 0.1;
    const low_bonus = 0.05;
    const min_bonus = 0;
    if (index === 0) return seller.profit * max_bonus;
    else if (index === 1 || index === 2) return seller.profit * high_bonus;
    else if (index === total - 1) return seller.profit * min_bonus;
    else return seller.profit * low_bonus;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных
    if (!data 
        || !Array.isArray(data.customers)
        || !Array.isArray(data.products)
        || !Array.isArray(data.sellers)
        || !Array.isArray(data.purchase_records)
        || data.customers.length === 0
        || data.products.length === 0
        || data.sellers.length === 0
        || data.purchase_records.length === 0 ) {
            throw new Error('Некорректные входные данные');
        }
    // @TODO: Проверка наличия опций
    const { calculateRevenue, calculateBonus } = options;
    if (typeof calculateRevenue !== "function"
        || typeof calculateBonus !== "function" ) {
            throw new Error('Некорректные функции для расчета данных')
        }
    // @TODO: Подготовка промежуточных данных для сбора статистики
    const sellerStats = data.sellers.map(seller => ({
        "id": seller.id, 
        "name": seller.first_name + " " + seller.last_name,
        "revenue": 0,
        "profit": 0,
        "sales_count": 0,
        "top_products": {},
        "produts_sales": {},
        "bonus": 0
    }))
    const productsStats = data.products.map(product => ({
        "name": product.name,
        "category": product.category,
        "sku": product.sku,
        "purchase_price": product.purchase_price,
        "sale_price": product.sale_price
    }))
    // @TODO: Индексация продавцов и товаров для быстрого доступа
    const sellerIndex = sellerStats.reduce((acc, obj) => ({
        ...acc,
        [obj.id]: obj
    }), {})

    const productIndex = productsStats.reduce((acc, obj) => ({
        ...acc,
        [obj.sku]: obj
    }), {})
    // @TODO: Расчет выручки и прибыли для каждого продавца
    data.purchase_records.forEach(record => {
        const seller = sellerIndex[record.seller_id];
        seller.sales_count++;
        seller.revenue += record.total_amount;
        record.items.forEach(item => {
            const product = productIndex[item.sku];
            const cost = product.purchase_price * item.quantity;
            const revenue = calculateRevenue(item, product);
            const profit = revenue - cost;
            seller.profit += profit;
            if (!seller.produts_sales[item.sku]) {
                seller.produts_sales[item.sku] = 0;
            }
            seller.produts_sales[item.sku]++;
        })
    })
    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}
