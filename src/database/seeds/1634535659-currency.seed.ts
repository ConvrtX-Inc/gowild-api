import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Currency } from '../../currency/currency.entity';

export default class CreateCurrency implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const count = await connection
      .createQueryBuilder()
      .select()
      .from(Currency, 'Currency')
      .getCount();

    if (count === 0) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Currency)
        .values([
          {
            currency_name: 'Albanian Lek',
            currency_symbol: 'Lek',
            currency_code: 'ALL',
          },
          {
            currency_name: 'East Caribbean Dollar',
            currency_symbol: '$',
            currency_code: 'XCD',
          },
          {
            currency_name: 'Euro',
            currency_symbol: '€',
            currency_code: 'EUR',
          },
          {
            currency_name: 'Barbadian Dollar',
            currency_symbol: '$',
            currency_code: 'BBD',
          },
          {
            currency_name: 'Bhutanese Ngultrum',
            currency_symbol: '',
            currency_code: 'BTN',
          },
          {
            currency_name: 'Brunei Dollar',
            currency_symbol: '$',
            currency_code: 'BND',
          },
          {
            currency_name: 'Central African CFA Franc',
            currency_symbol: '',
            currency_code: 'XAF',
          },
          {
            currency_name: 'Cuban Peso',
            currency_symbol: '$',
            currency_code: 'CUP',
          },
          {
            currency_name: 'United States Dollar',
            currency_symbol: '$',
            currency_code: 'USD',
          },
          {
            currency_name: 'Falkland Islands Pound',
            currency_symbol: '£',
            currency_code: 'FKP',
          },
          {
            currency_name: 'Gibraltar Pound',
            currency_symbol: '£',
            currency_code: 'GIP',
          },
          {
            currency_name: 'Hungarian Forint',
            currency_symbol: 'Ft',
            currency_code: 'HUF',
          },
          {
            currency_name: 'Iranian Rial',
            currency_symbol: '﷼',
            currency_code: 'IRR',
          },
          {
            currency_name: 'Jamaican Dollar',
            currency_symbol: 'J$',
            currency_code: 'JMD',
          },
          {
            currency_name: 'Australian Dollar',
            currency_symbol: '$',
            currency_code: 'AUD',
          },
          {
            currency_name: 'Lao Kip',
            currency_symbol: '₭',
            currency_code: 'LAK',
          },
          {
            currency_name: 'Libyan Dinar',
            currency_symbol: '',
            currency_code: 'LYD',
          },
          {
            currency_name: 'Macedonian Denar',
            currency_symbol: 'ден',
            currency_code: 'MKD',
          },
          {
            currency_name: 'West African CFA Franc',
            currency_symbol: '',
            currency_code: 'XOF',
          },
          {
            currency_name: 'New Zealand Dollar',
            currency_symbol: '$',
            currency_code: 'NZD',
          },
          {
            currency_name: 'Omani Rial',
            currency_symbol: '﷼',
            currency_code: 'OMR',
          },
          {
            currency_name: 'Papua New Guinean Kina',
            currency_symbol: '',
            currency_code: 'PGK',
          },
          {
            currency_name: 'Rwandan Franc',
            currency_code: 'RWF',
          },
          {
            currency_name: 'Samoan Tala',
            currency_code: 'WST',
          },
          {
            currency_name: 'Serbian Dinar',
            currency_symbol: 'Дин.',
            currency_code: 'RSD',
          },
          {
            currency_name: 'Swedish Krona',
            currency_symbol: 'kr',
            currency_code: 'SEK',
          },
          {
            currency_name: 'Tanzanian Shilling',
            currency_symbol: 'TSh',
            currency_code: 'TZS',
          },
          {
            currency_name: 'Armenian Dram',
            currency_code: 'AMD',
          },
          {
            currency_name: 'Bahamian Dollar',
            currency_symbol: '$',
            currency_code: 'BSD',
          },
          {
            currency_name: 'Bosnia And Herzegovina Konvertibilna Marka',
            currency_symbol: 'KM',
            currency_code: 'BAM',
          },
          {
            currency_name: 'Cape Verdean Escudo',
            currency_code: 'CVE',
          },
          {
            currency_name: 'Chinese Yuan',
            currency_symbol: '¥',
            currency_code: 'CNY',
          },
          {
            currency_name: 'Costa Rican Colon',
            currency_symbol: '₡',
            currency_code: 'CRC',
          },
          {
            currency_name: 'Czech Koruna',
            currency_symbol: 'Kč',
            currency_code: 'CZK',
          },
          {
            currency_name: 'Eritrean Nakfa',
            currency_code: 'ERN',
          },
          {
            currency_name: 'Georgian Lari',
            currency_code: 'GEL',
          },
          {
            currency_name: 'Haitian Gourde',
            currency_code: 'HTG',
          },
          {
            currency_name: 'Indian Rupee',
            currency_symbol: '₹',
            currency_code: 'INR',
          },
          {
            currency_name: 'Jordanian Dinar',
            currency_code: 'JOD',
          },
          {
            currency_name: 'South Korean Won',
            currency_symbol: '₩',
            currency_code: 'KRW',
          },
          {
            currency_name: 'Lebanese Lira',
            currency_symbol: '£',
            currency_code: 'LBP',
          },
          {
            currency_name: 'Malawian Kwacha',
            currency_code: 'MWK',
          },
          {
            currency_name: 'Mauritanian Ouguiya',
            currency_code: 'MRO',
          },
          {
            currency_name: 'Mozambican Metical',
            currency_code: 'MZN',
          },
          {
            currency_name: 'Netherlands Antillean Gulden',
            currency_symbol: 'ƒ',
            currency_code: 'ANG',
          },
          {
            currency_name: 'Peruvian Nuevo Sol',
            currency_symbol: 'S/.',
            currency_code: 'PEN',
          },
          {
            currency_name: 'Qatari Riyal',
            currency_symbol: '﷼',
            currency_code: 'QAR',
          },
          {
            currency_name: 'Sao Tome And Principe Dobra',
            currency_code: 'STD',
          },
          {
            currency_name: 'Sierra Leonean Leone',
            currency_code: 'SLL',
          },
          {
            currency_name: 'Somali Shilling',
            currency_symbol: 'S',
            currency_code: 'SOS',
          },
          {
            currency_name: 'Sudanese Pound',
            currency_code: 'SDG',
          },
          {
            currency_name: 'Syrian Pound',
            currency_symbol: '£',
            currency_code: 'SYP',
          },
          {
            currency_name: 'Angolan Kwanza',
            currency_code: 'AOA',
          },
          {
            currency_name: 'Aruban Florin',
            currency_symbol: 'ƒ',
            currency_code: 'AWG',
          },
          {
            currency_name: 'Bahraini Dinar',
            currency_code: 'BHD',
          },
          {
            currency_name: 'Belize Dollar',
            currency_symbol: 'BZ$',
            currency_code: 'BZD',
          },
          {
            currency_name: 'Botswana Pula',
            currency_symbol: 'P',
            currency_code: 'BWP',
          },
          {
            currency_name: 'Burundi Franc',
            currency_code: 'BIF',
          },
          {
            currency_name: 'Cayman Islands Dollar',
            currency_symbol: '$',
            currency_code: 'KYD',
          },
          {
            currency_name: 'Colombian Peso',
            currency_symbol: '$',
            currency_code: 'COP',
          },
          {
            currency_name: 'Danish Krone',
            currency_symbol: 'kr',
            currency_code: 'DKK',
          },
          {
            currency_name: 'Guatemalan Quetzal',
            currency_symbol: 'Q',
            currency_code: 'GTQ',
          },
          {
            currency_name: 'Honduran Lempira',
            currency_symbol: 'L',
            currency_code: 'HNL',
          },
          {
            currency_name: 'Indonesian Rupiah',
            currency_symbol: 'Rp',
            currency_code: 'IDR',
          },
          {
            currency_name: 'Israeli New Sheqel',
            currency_symbol: '₪',
            currency_code: 'ILS',
          },
          {
            currency_name: 'Kazakhstani Tenge',
            currency_symbol: 'лв',
            currency_code: 'KZT',
          },
          {
            currency_name: 'Kuwaiti Dinar',
            currency_code: 'KWD',
          },
          {
            currency_name: 'Lesotho Loti',
            currency_code: 'LSL',
          },
          {
            currency_name: 'Malaysian Ringgit',
            currency_symbol: 'RM',
            currency_code: 'MYR',
          },
          {
            currency_name: 'Mauritian Rupee',
            currency_symbol: '₨',
            currency_code: 'MUR',
          },
          {
            currency_name: 'Mongolian Tugrik',
            currency_symbol: '₮',
            currency_code: 'MNT',
          },
          {
            currency_name: 'Myanma Kyat',
            currency_code: 'MMK',
          },
          {
            currency_name: 'Nigerian Naira',
            currency_symbol: '₦',
            currency_code: 'NGN',
          },
          {
            currency_name: 'Panamanian Balboa',
            currency_symbol: 'B/.',
            currency_code: 'PAB',
          },
          {
            currency_name: 'Philippine Peso',
            currency_symbol: '₱',
            currency_code: 'PHP',
          },
          {
            currency_name: 'Romanian Leu',
            currency_symbol: 'lei',
            currency_code: 'RON',
          },
          {
            currency_name: 'Saudi Riyal',
            currency_symbol: '﷼',
            currency_code: 'SAR',
          },
          {
            currency_name: 'Singapore Dollar',
            currency_symbol: '$',
            currency_code: 'SGD',
          },
          {
            currency_name: 'South African Rand',
            currency_symbol: 'R',
            currency_code: 'ZAR',
          },
          {
            currency_name: 'Surinamese Dollar',
            currency_symbol: '$',
            currency_code: 'SRD',
          },
          {
            currency_name: 'New Taiwan Dollar',
            currency_symbol: 'NT$',
            currency_code: 'TWD',
          },
          {
            currency_name: 'Paanga',
            currency_code: 'TOP',
          },
          {
            currency_name: 'Venezuelan Bolivar',
            currency_code: 'VEF',
          },
          {
            currency_name: 'Algerian Dinar',
            currency_code: 'DZD',
          },
          {
            currency_name: 'Argentine Peso',
            currency_symbol: '$',
            currency_code: 'ARS',
          },
          {
            currency_name: 'Azerbaijani Manat',
            currency_symbol: 'ман',
            currency_code: 'AZN',
          },
          {
            currency_name: 'Belarusian Ruble',
            currency_symbol: 'p.',
            currency_code: 'BYR',
          },
          {
            currency_name: 'Bolivian Boliviano',
            currency_symbol: '$b',
            currency_code: 'BOB',
          },
          {
            currency_name: 'Bulgarian Lev',
            currency_symbol: 'лв',
            currency_code: 'BGN',
          },
          {
            currency_name: 'Canadian Dollar',
            currency_symbol: '$',
            currency_code: 'CAD',
          },
          {
            currency_name: 'Chilean Peso',
            currency_symbol: '$',
            currency_code: 'CLP',
          },
          {
            currency_name: 'Congolese Franc',
            currency_code: 'CDF',
          },
          {
            currency_name: 'Dominican Peso',
            currency_symbol: 'RD$',
            currency_code: 'DOP',
          },
          {
            currency_name: 'Fijian Dollar',
            currency_symbol: '$',
            currency_code: 'FJD',
          },
          {
            currency_name: 'Gambian Dalasi',
            currency_code: 'GMD',
          },
          {
            currency_name: 'Guyanese Dollar',
            currency_symbol: '$',
            currency_code: 'GYD',
          },
          {
            currency_name: 'Icelandic Króna',
            currency_symbol: 'kr',
            currency_code: 'ISK',
          },
          {
            currency_name: 'Iraqi Dinar',
            currency_code: 'IQD',
          },
          {
            currency_name: 'Japanese Yen',
            currency_symbol: '¥',
            currency_code: 'JPY',
          },
          {
            currency_name: 'North Korean Won',
            currency_symbol: '₩',
            currency_code: 'KPW',
          },
          {
            currency_name: 'Latvian Lats',
            currency_symbol: 'Ls',
            currency_code: 'LVL',
          },
          {
            currency_name: 'Swiss Franc',
            currency_symbol: 'Fr.',
            currency_code: 'CHF',
          },
          {
            currency_name: 'Malagasy Ariary',
            currency_code: 'MGA',
          },
          {
            currency_name: 'Moldovan Leu',
            currency_code: 'MDL',
          },
          {
            currency_name: 'Moroccan Dirham',
            currency_code: 'MAD',
          },
          {
            currency_name: 'Nepalese Rupee',
            currency_symbol: '₨',
            currency_code: 'NPR',
          },
          {
            currency_name: 'Nicaraguan Cordoba',
            currency_symbol: 'C$',
            currency_code: 'NIO',
          },
          {
            currency_name: 'Pakistani Rupee',
            currency_symbol: '₨',
            currency_code: 'PKR',
          },
          {
            currency_name: 'Paraguayan Guarani',
            currency_symbol: 'Gs',
            currency_code: 'PYG',
          },
          {
            currency_name: 'Saint Helena Pound',
            currency_symbol: '£',
            currency_code: 'SHP',
          },
          {
            currency_name: 'Seychellois Rupee',
            currency_symbol: '₨',
            currency_code: 'SCR',
          },
          {
            currency_name: 'Solomon Islands Dollar',
            currency_symbol: '$',
            currency_code: 'SBD',
          },
          {
            currency_name: 'Sri Lankan Rupee',
            currency_symbol: '₨',
            currency_code: 'LKR',
          },
          {
            currency_name: 'Thai Baht',
            currency_symbol: '฿',
            currency_code: 'THB',
          },
          {
            currency_name: 'Turkish New Lira',
            currency_code: 'TRY',
          },
          {
            currency_name: 'UAE Dirham',
            currency_code: 'AED',
          },
          {
            currency_name: 'Vanuatu Vatu',
            currency_code: 'VUV',
          },
          {
            currency_name: 'Yemeni Rial',
            currency_symbol: '﷼',
            currency_code: 'YER',
          },
          {
            currency_name: 'Afghan Afghani',
            currency_symbol: '؋',
            currency_code: 'AFN',
          },
          {
            currency_name: 'Bangladeshi Taka',
            currency_code: 'BDT',
          },
          {
            currency_name: 'Brazilian Real',
            currency_symbol: 'R$',
            currency_code: 'BRL',
          },
          {
            currency_name: 'Cambodian Riel',
            currency_symbol: '៛',
            currency_code: 'KHR',
          },
          {
            currency_name: 'Comorian Franc',
            currency_code: 'KMF',
          },
          {
            currency_name: 'Croatian Kuna',
            currency_symbol: 'kn',
            currency_code: 'HRK',
          },
          {
            currency_name: 'Djiboutian Franc',
            currency_code: 'DJF',
          },
          {
            currency_name: 'Egyptian Pound',
            currency_symbol: '£',
            currency_code: 'EGP',
          },
          {
            currency_name: 'Ethiopian Birr',
            currency_code: 'ETB',
          },
          {
            currency_name: 'CFP Franc',
            currency_code: 'XPF',
          },
          {
            currency_name: 'Ghanaian Cedi',
            currency_code: 'GHS',
          },
          {
            currency_name: 'Guinean Franc',
            currency_code: 'GNF',
          },
          {
            currency_name: 'Hong Kong Dollar',
            currency_symbol: '$',
            currency_code: 'HKD',
          },
          {
            currency_name: 'Special Drawing Rights',
            currency_code: 'XDR',
          },
          {
            currency_name: 'Kenyan Shilling',
            currency_symbol: 'KSh',
            currency_code: 'KES',
          },
          {
            currency_name: 'Kyrgyzstani Som',
            currency_symbol: 'лв',
            currency_code: 'KGS',
          },
          {
            currency_name: 'Liberian Dollar',
            currency_symbol: '$',
            currency_code: 'LRD',
          },
          {
            currency_name: 'Macanese Pataca',
            currency_code: 'MOP',
          },
          {
            currency_name: 'Maldivian Rufiyaa',
            currency_code: 'MVR',
          },
          {
            currency_name: 'Mexican Peso',
            currency_symbol: '$',
            currency_code: 'MXN',
          },
          {
            currency_name: 'Namibian Dollar',
            currency_symbol: '$',
            currency_code: 'NAD',
          },
          {
            currency_name: 'Norwegian Krone',
            currency_symbol: 'kr',
            currency_code: 'NOK',
          },
          {
            currency_name: 'Polish Zloty',
            currency_symbol: 'zł',
            currency_code: 'PLN',
          },
          {
            currency_name: 'Russian Ruble',
            currency_symbol: 'руб',
            currency_code: 'RUB',
          },
          {
            currency_name: 'Swazi Lilangeni',
            currency_code: 'SZL',
          },
          {
            currency_name: 'Tajikistani Somoni',
            currency_code: 'TJS',
          },
          {
            currency_name: 'Trinidad and Tobago Dollar',
            currency_symbol: 'TT$',
            currency_code: 'TTD',
          },
          {
            currency_name: 'Ugandan Shilling',
            currency_symbol: 'USh',
            currency_code: 'UGX',
          },
          {
            currency_name: 'Uruguayan Peso',
            currency_symbol: '$U',
            currency_code: 'UYU',
          },
          {
            currency_name: 'Vietnamese Dong',
            currency_symbol: '₫',
            currency_code: 'VND',
          },
          {
            currency_name: 'Tunisian Dinar',
            currency_code: 'TND',
          },
          {
            currency_name: 'Ukrainian Hryvnia',
            currency_symbol: '₴',
            currency_code: 'UAH',
          },
          {
            currency_name: 'Uzbekistani Som',
            currency_symbol: 'лв',
            currency_code: 'UZS',
          },
          {
            currency_name: 'Turkmenistan Manat',
            currency_code: 'TMT',
          },
          {
            currency_name: 'British Pound',
            currency_symbol: '£',
            currency_code: 'GBP',
          },
          {
            currency_name: 'Zambian Kwacha',
            currency_code: 'ZMW',
          },
          {
            currency_name: 'Bitcoin',
            currency_symbol: 'BTC',
            currency_code: 'BTC',
          },
          {
            currency_name: 'New Belarusian Ruble',
            currency_symbol: 'p.',
            currency_code: 'BYN',
          },
          {
            currency_name: 'Bermudan Dollar',
            currency_code: 'BMD',
          },
          {
            currency_name: 'Guernsey Pound',
            currency_code: 'GGP',
          },
          {
            currency_name: 'Chilean Unit Of Account',
            currency_code: 'CLF',
          },
          {
            currency_name: 'Cuban Convertible Peso',
            currency_code: 'CUC',
          },
          {
            currency_name: 'Manx pound',
            currency_code: 'IMP',
          },
          {
            currency_name: 'Jersey Pound',
            currency_code: 'JEP',
          },
          {
            currency_name: 'Salvadoran Colón',
            currency_code: 'SVC',
          },
          {
            currency_name: 'Old Zambian Kwacha',
            currency_code: 'ZMK',
          },
          {
            currency_name: 'Silver (troy ounce)',
            currency_code: 'XAG',
          },
          {
            currency_name: 'Zimbabwean Dollar',
            currency_code: 'ZWL',
          },
        ])
        .execute();
    }
  }
}
