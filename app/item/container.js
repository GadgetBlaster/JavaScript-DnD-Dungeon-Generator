
import rarity from '../attribute/rarity';
import size from '../attribute/size';

const { tiny, small, medium, large } = size;
const { abundant, common, rare } = rarity;

const capacities = {
    [tiny]: 0.5,
    [small]: 1,
    [medium]: 10,
    [large]: 20,
};

const defaults = {
    size: small,
    rarity: common,
};

const config = [
    { name: 'Backpack',             size: large                             },
    { name: 'Barrel, large',        size: large                             },
    { name: 'Barrel, medium',       size: medium                            },
    { name: 'Barrel, small',                                                },
    { name: 'Basket',                                                       },
    { name: 'Bottle, glass',        size: tiny                              },
    { name: 'Bucket',                                                       },
    { name: 'Case, crossbow bolt',                                          },
    { name: 'Case, map or scroll',                                          },
    { name: 'Chest, large',         size: large                             },
    { name: 'Chest, medium',        size: medium                            },
    { name: 'Chest, small',                                                 },
    { name: 'Component pouch',      size: small,    rarity: rare            },
    { name: 'Flask'                                                         },
    { name: 'Tankard',              size: tiny,     rarity: abundant        },
];

export default config.map((item) => ({
    ...defaults,
    ...item,
    capacity: capacities[item.size] || capacities[defaults.size],
}));
