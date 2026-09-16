import React, { useState, useMemo } from 'react';
import { ScreenId, CropLot, OrderCart, UpiPaymentDetails } from '../../types';
import { InspectionModal } from '../InspectionModal';
import { UpiPaymentQrModal } from '../UpiPaymentQrModal';

interface BuyCropsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const BuyCropsScreen: React.FC<BuyCropsScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(25);
  const [sortBy, setSortBy] = useState<'fresh' | 'price_asc' | 'distance' | 'volume'>('fresh');
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [selectedCropForModal, setSelectedCropForModal] = useState<CropLot | null>(null);

  // Cart / Escrow State
  const [cartQuantityQtl, setCartQuantityQtl] = useState<number>(50);
  const [activeLotId, setActiveLotId] = useState<string>('FS-NSK-8821');
  const [isEscrowLocked, setIsEscrowLocked] = useState(false);
  const [checkoutSuccessMsg, setCheckoutSuccessMsg] = useState<string | null>(null);

  // UPI Payment Modal State
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [upiDetails, setUpiDetails] = useState<UpiPaymentDetails>({
    vpa: 'ramesh.patil@sbi',
    payeeName: 'Ramesh Patil (Kisan)',
    amount: 124600,
    transactionNote: 'FarmSync Order Checkout Direct Payment',
    refId: 'FS-ORD-MH-9941',
  });

  // Map strip image hotlink
  const mapStripUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCEEF_UWVF6FcYtqHqJvh0684I_nhmzxON-5oO15Vlf2hC_L3J2II9KkJ3a8u-ZzoTWwZNv5iU9HVJoD5jLwH4zMu6ztvcyRIVq7QUWs6aiOtvbZHh5biWtw7gXWbbiV4mgy4tkq5JjImCI4Ru9qekqstfChiqQwECXEdJbnSjQxiPTnh0ZGr4BvjAeHWeiSVUiuZmiguaVdW2wfqqUH-CEIG2lLf8YOaVG4NdhS2CLg2BO2KGhGfI';

  // Crop Lots data
  const cropLots: CropLot[] = [
    {
      id: 'FS-NSK-8821',
      batchCode: 'BATCH #FS-NSK-8821',
      title: 'Nashik Red Onions (Garwa Variety)',
      variety: 'Garwa Winter Crop • Grade A Export Quality',
      farmerName: 'Ramesh Patil',
      farmerLocation: 'Niphad, Nashik Region',
      distanceKm: 14.2,
      rating: 4.9,
      dealsCount: 48,
      pricePerUnit: 2450,
      unit: 'Qtl',
      apmcAvgPrice: 2650,
      mspPrice: 2150,
      safeMin: 2200,
      safeMax: 2600,
      ceilingPrice: 2850,
      availableStock: '150 Quintals (300 Bags)',
      minOrderQty: '20 Quintals (40 Bags)',
      packaging: '50 kg Red Ventilated Leno Mesh Bags',
      transitReady: 'Ready for Immediate Farm Gate Loading (4.5 hrs to Vashi)',
      category: 'vegetables',
      isHighDemand: true,
      harvestDateText: 'Harvested 48 hrs ago • Cured 3 weeks',
      verifiedBadges: ['e-NAM Grade A', '11.4% Moisture (Safe)', 'Vernier 58.4mm'],
      photos: [
        {
          label: 'Bulb Caliber',
          sublabel: '58.4 mm Vernier',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy_paWB56X8oFPlaepAXdh7eplSVbFc4aOeXPdsphyYtnl3ZydwTatTX2_ejS2qy8dpXwJoN1vmyYh3O239kEsyoyDcHHuBiEp-YxzE_jnal2OAoyv8umJwydGYDh2cBQEGtT6Qj3iVB1s1B1v4jZoUqp8_Jh24yeYtWHIxWtAb-55gOZoPqjoBBoIG1gBdfkwH6pha9pxqMM5vwnxq6DLTuKsjXWQ3kk0opGCp-Xqwcl2wLDH6zU',
        },
        {
          label: 'Moisture Probe',
          sublabel: '11.4% Insertion',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcCOFx2zcWUxXzuK-9nTrdu21v7EhIqNf_JnT_y30jVeI-1-xDMthhXGSqg1fYko1eSUQHdBXj7rikCP-3RghDha9X8Dg-FEKwWMyUu3_bt-asj4kaLUYCfaTp6O4o3BOn31g7BrOZnXCqbwGdhmiSIDKiO8GEEWJbf3-Yfe7slazgyBD4tKcfOkAUqkg4faS-ot3Tz67QFUZB9-j_TVPiUV3xJ521cjq_17YNOhCLZT_ziXg1TI4',
        },
        {
          label: '300 Leno Bags',
          sublabel: 'Pallet Stacked',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOXsEnkqAoIkY9LUtkHnGrhfJb53k5bQCwTZR4_vZVILs_2zEyIkBkL4I4Ps3CZbQ3tBp8_jNpl-loKaZ79xxFG7CwnleqN08Tpe78fnU_63EJMmc4-_NSQA1nnR5-OYt2ZbHRJ-YbqN4EAF_9LaABRzwHMDZJmGKnhTIOvYpS0a7YXRGO3QWXKw9geROmN-ngaG6OR3vp6RGZFeiHgm0N96xsD0rgycY43yWBgSfjLALEVXFedTs',
        },
        {
          label: 'Cut Test',
          sublabel: '0% Decay',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2VmOiBMQ5AsPSXrge5mXMIMp-1QzRPLMyAQl0IlIwWtiO_NOwzLykv5jKGv3EKWF5KHR2XTHBM7rG3xghN-2wm6geJwaLnD42NdzbA_k6Px_f6LdAO1TCaGu3q5tj1iv-X_Tc774wgbevibeA-pmgRbzQyzEKTzqEsjnZWuHBNyMiV4jlHwWDD9tfYl-t1jPdtjTsqitzRfDKrwRZy5BXX587FUD0fWuCYXfs22ke2W67HzTRlUs',
        },
        {
          label: 'KVK Report',
          sublabel: 'Residue Clear',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkhFCyhsmsmnnvkcePejFSE8DdF-NSBB1yCgj8M-56vhQuI8Jk2UQwhwNOfMFyldidabEYtUvyCpE0evpPF5Pm_3m8plwws9aKg_YFDNj0VvUdAnE-t4EvYA2djkXs6qsCvDJ26o1JI_hHltX3mRhlsLYzc6abHlmQdECw78YuHHJ-jzjbb2UMBHCV1YHsmyDfzsE50f8XLzS5bshzLYFKVNIvS-LHpKgBX3kyaDpbKK3qpaVjRA8',
        },
      ],
    },
    {
      id: 'FS-WHT-4210',
      batchCode: 'BATCH #FS-WHT-4210',
      title: 'Sharbati MP Premium Wheat',
      variety: 'Sehore Sharbati Golden Grain • Unpolished Extra Bold',
      farmerName: 'Digambar Rao',
      farmerLocation: 'Sehore Hub (Transport Depot)',
      distanceKm: 28.4,
      rating: 4.8,
      dealsCount: 34,
      pricePerUnit: 2880,
      unit: 'Qtl',
      apmcAvgPrice: 3120,
      mspPrice: 2275,
      safeMin: 2600,
      safeMax: 3000,
      ceilingPrice: 3300,
      availableStock: '220 Quintals (440 Sacks)',
      minOrderQty: '30 Quintals (60 Sacks)',
      packaging: '50 kg Clean Heavy Jute Gunny Bags',
      transitReady: 'Moisture Tested (10.8%) • Immediate Dispatch',
      category: 'grains',
      isHighDemand: true,
      harvestDateText: 'Harvested March 2026 • Machine Threshed',
      verifiedBadges: ['Agmark Special', '10.8% Dryness', 'Zero Foreign Matter'],
      photos: [
        {
          label: 'Golden Grains',
          sublabel: 'Sharbati Luster',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3sSNSvpEpc05o3ND7kAgAc9RjJeLabwXA-Bzd7mXB649g0tfyleS1RGqR7NM9V3lMikWLkRungAPs418IxxsdZooPr4x01z8_BvPKRyu-PLNFIXFc2znZdEC3sutCuJ7vXdS433pRREmnOw6CAtShx0BGOgsBlcJ6OddjWB7_3dgis3IU9FSC_LRUs9y0cRAIhLBuEtpHxdFOFfL72khRkNvqhhQ2S752y7so4Frbzh5cwTi1Uk0',
        },
        {
          label: 'Moisture Test',
          sublabel: '10.8% Grain Meter',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY-DyT3CzXb5efx6YI_9Y6QOMo_cJSy6pP3EeY4PHTSNyEOxyCUjruCSUrhrSFz-Q6Ni-1P26D0REOVROARPXVuhN26N9ZsaLppUMZWH-U6w8vYUFtWTjFumt2ZTwlB4FgGh8iOEXIFlUFveRszZApjmTtwz1PjROJ5a90rXtwPZHleSxpL5lXrqXm5EAgDIUVwtnf-dSMQlogfcuuR2eadYEKVlxDVkxkkG1rjXL-oz9foh5n9Vo',
        },
        {
          label: 'Jute Stack',
          sublabel: '440 Clean Sacks',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZCexLrFrukWLK2VbXoZS-Qdu5xgRbe-VsbVK5tJUEIXMlvijcNznWBJNjS9zXaGrIhC_0mF1d3pQu8Jv5pSe-BKeDhP8XNve8YdBUFyo53zy1VvOIAg4AATKu8AT6kZ0LCfEvpKA3kwM835IbxfAS-GNnj2NgFDa3pQH6A-kFM5fJIhidVIUErZIIPJCW0wvBXLfhRYAnbJeeQqZBNNkwXnrOAP3icBZ1rx7hOHT_ENStfdjRg0A',
        },
        {
          label: 'Kernel Purity',
          sublabel: '99.4% Sound Grain',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkz-omzip0hTvs9MbcQqSvDsStXJTHDrOB5X22NEbqliO6C-GLubSFUzEqSpqEgLt5tZlNeYJ5bnL2szy00pyZTUk6O2NU1iBiSU55RDkY6jt_xUL3F3nbQbyFrC4FtalzZlUQuTFxteO5javv2cuJtjOscKaEhtlPuJtp3cxY1Diqh246QJvdjeeqOS78W9Eg3u8f1W843YCC0G-6Sq2zysiUWjVG4VvPznqjEub5E02BGHiReRo',
        },
        {
          label: 'Agmark Seal',
          sublabel: 'Lab Certified',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKtfEV0UMAHysxVg-RJHV4mDhvYqGWyjiWUMzGVNMNJt4BeUJfBnURNz-YXKKO8EGwJuoz1qUuWkKtfS8GnIkLnJcJcAoXPc06tdV9iF9yiaX3jAsIGCQiqYumoouRDuIoNyN7Wr-pgsTJKWdGw9RZpwoiO_DgrMfNM0zY55raj0PsdB7yakT4SNLaoCSO3RnCJHtPbBuZ8Ghbk4L6sTERwSEjjr5fuOD7roqyHjlFWmbFuZKiVaY',
        },
      ],
    },
    {
      id: 'FS-TOM-7721',
      batchCode: 'BATCH #FS-TOM-7721',
      title: 'Fresh Hybrid Himsona Tomatoes',
      variety: 'Himsona Table Tomato • Firm Thick Skin for Travel',
      farmerName: 'Balasaheb Shinde',
      farmerLocation: 'Narayangaon Belt, Pune',
      distanceKm: 21.0,
      rating: 4.7,
      dealsCount: 29,
      pricePerUnit: 1850,
      unit: 'Qtl',
      apmcAvgPrice: 2200,
      mspPrice: 1400,
      safeMin: 1600,
      safeMax: 2100,
      ceilingPrice: 2500,
      availableStock: '140 Quintals (350 Plastic Crates)',
      minOrderQty: '15 Quintals (35 Crates)',
      packaging: 'Standard 25 kg Ventilated Plastic Crates',
      transitReady: 'Plucked this morning at 6:00 AM • Ready now',
      category: 'vegetables',
      isHighDemand: false,
      harvestDateText: 'Harvested Today at Dawn',
      verifiedBadges: ['Firmness 8.2 kg/cm²', 'Grade 1 Red', 'Zero Bruise'],
      photos: [
        {
          label: 'Fresh Crate',
          sublabel: 'Deep Red Gloss',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbuP-Qbf3w2zUHDJizlGiqeA45-LjAunV-WjuInxY-AXfmW7U-7f9u6aldwa44byn5hzH-bJ_kRRfy-qtiomgqo9pGzFZTdOeYHVkvfpf8-HC5nWwpX6LGiF2DtaZ28pQZIJ2VNYPHLupHSXY4NwAg9EyprD9_qbEWnVgNqGdhbvXZYAJVEvd2B7f9V64p0miCylYM1MQtBDAYkKF0idI1bFWw7PZTtPCAslq2yGqSzYof83Vic_M',
        },
        {
          label: 'Durometer Test',
          sublabel: 'Firmness 8.2',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCafh0xAFoN9Ypky7eZFmYoNYaeEq3XNZ2dk9V6A_xPvmTEXUNuKRo9zHB3gbeoiEEqLygFRa9Uoa0xwYboPfIgC4W-xCxjX9hVAaIh8K5CVluIt5u-Wz_WVVNhElh4iAfVzzYCHqLlUR_AfBFZnhRKCOCviS0mQFPq-v0rmtC-_lslGUcohXtmK1ZNcGwHIwz-0pKaedDgWHM2gQ-wLMDAxa399EsvnhFU2jvStUgabXda8bwZMOQ',
        },
        {
          label: 'Grading Conveyor',
          sublabel: 'Size Sorted',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARfO3EWpJjIYPna3tqGUDjE8uCtCtEL8zFTXz5nuvSSjfeDuyaYeZuOihhJ85Xawpgky6YqC1UjtDODvzUXYvAaZLkg_fBy_0b7WDz2HgR2aax2LV5NSGYhQE9hfH0V9F5Nb8P1JvzG0leyGLDxlN8RJeC7yNoxyjI30MOQ6784_firo2rhHgK2Nbav3lWGfGUGA_ircBdvzrJ8oqwjMjo630s5AJ2qadMg5-jSNVCTSp7Oe_CZ7c',
        },
      ],
    },
    {
      id: 'FS-DAL-6091',
      batchCode: 'BATCH #FS-DAL-6091',
      title: 'Organic Yellow Desi Toor Dal',
      variety: 'Desi Akola Pigeon Pea • Unpolished Sun-Dried',
      farmerName: 'Suresh Deshmukh',
      farmerLocation: 'Akola Agricultural Hub',
      distanceKm: 32.1,
      rating: 5.0,
      dealsCount: 52,
      pricePerUnit: 9400,
      unit: 'Qtl',
      apmcAvgPrice: 10200,
      mspPrice: 7550,
      safeMin: 8500,
      safeMax: 9800,
      ceilingPrice: 11000,
      availableStock: '80 Quintals (160 Bags)',
      minOrderQty: '10 Quintals (20 Bags)',
      packaging: '50 kg Double-Stitched Moisture Proof Bags',
      transitReady: 'Moisture 9.2% • Ready for Dispatch',
      category: 'pulses',
      isHighDemand: false,
      harvestDateText: 'Harvested Feb 2026 • Farm Cleaned',
      verifiedBadges: ['NPOP Organic', 'Zero Chemical Wax', 'Unpolished Grade A'],
      photos: [
        {
          label: 'Split Lentils',
          sublabel: 'Pure Desi Grain',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBBHbPtKEPn_GtGc1LyPbv9JKF8G3rfWYyGBs9blW8NU8Lb_Fg1Xbk_znK-T_3EAOGi814nBotCx43JKDxrZw2PTn0Vzy4JvNNBRkp60HG37y5RQkbYLB1Fzq79hg2DZ23kC0ygRpBYI6ndVwB0UfmIn8ZhXJQJGgfqdLs1r6lVCzy-Vv4OKLZ1o27CbkcrxYSasiJPgpjtwTtIY76mQEyKelFf3FVDwMop_tf8J7vmRT_dSZLvSM',
        },
        {
          label: 'Moisture Chamber',
          sublabel: '9.2% Premium',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiiFFUvtP448odLixF_izHfG8dzN6N5zCitp-7w5vWoYF-fGxC1QshpQdW7-hWu8iZJMG5MQ3FzYxFQnMIAlsdjBLR-RxMhu7dcKKLAYyShwjIX6VTuVlwjWP2d-KB-0bYTxKBXI4IaU7MXKSiD8MEgQW0ha4JXKEQeFVJPYYDgfxlFzNEeXLhG7NkA5C6rmsKb8mMcK44GIDHz0YICKmoI0h21CzUqM47rEbdnB_niwXvTBwxwO8',
        },
        {
          label: 'Organic NPOP Seal',
          sublabel: 'Tested Residue Free',
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmlwQ-6aKAh8SqQs_D-5_N_bBeDrGoUvsDygyyVWKKS4ryZUp6JOiKZffrRqqKi-eQF_pzgvRIRqOi43CMEhv76-ATOr0J5byLdg3C09DsLoENT4xGcLeCDPtbC_3DHNmz7Npi9W1xH_xkXNnUjxJh1qwtHS0Kky9hCAyGT-mMDaLB8g6YOpObggCWpFZ6Pk1UZKss2hfmtiOkH8JCK6YsgxKuagSku-mSazHv6Mtj65YvCA6HjAQ',
        },
      ],
    },
  ];

  // Active lot for sidebar
  const currentActiveLot = useMemo(() => {
    return cropLots.find((lot) => lot.id === activeLotId) || cropLots[0];
  }, [activeLotId, cropLots]);

  // Filter and sort
  const filteredLots = useMemo(() => {
    return cropLots.filter((lot) => {
      const matchesSearch =
        searchQuery === '' ||
        lot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.batchCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lot.farmerLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || lot.category === selectedCategory;

      const matchesRadius = lot.distanceKm <= searchRadiusKm;

      return matchesSearch && matchesCategory && matchesRadius;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      return 0; // Default fresh
    });
  }, [cropLots, searchQuery, selectedCategory, searchRadiusKm, sortBy]);

  // Pricing calculations
  const cropSubtotal = currentActiveLot.pricePerUnit * cartQuantityQtl;
  const traditionalApmcTotal = currentActiveLot.apmcAvgPrice * cartQuantityQtl;
  const traditionalBrokerageCut = Math.round(traditionalApmcTotal * 0.08); // 8% dalali in traditional mandi
  const transporterFee = Math.round(1800 + currentActiveLot.distanceKm * 45 * (cartQuantityQtl / 50));
  const techFee = Math.round(cropSubtotal * 0.008); // 0.8% escrow & weighbridge insurance
  const totalEscrowPayable = cropSubtotal + transporterFee + techFee;
  const totalRetailerSavings = Math.max(0, traditionalApmcTotal + traditionalBrokerageCut - totalEscrowPayable);

  const handleLockEscrow = () => {
    setIsEscrowLocked(true);
    setCheckoutSuccessMsg(
      `Escrow of ₹${totalEscrowPayable.toLocaleString('en-IN')} successfully reserved for ${currentActiveLot.title} (${cartQuantityQtl} Qtl). Eicher Pro truck dispatched to ${currentActiveLot.farmerName}'s farm gate!`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-6 space-y-8">
      {/* Search, Radius Filter & Category Bar */}
      <div className="space-y-4">
        {/* Top Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops, variety, kisan name, e-NAM lot ID... (Alt+K)"
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-surface-container-lowest border border-surface-container-high focus:outline-none focus:border-primary font-body-md text-on-surface shadow-xs"
              id="marketplace-search-input"
            />
          </div>

          {/* Radius Filter */}
          <div className="md:col-span-4 p-3 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-[16px]">
                  near_me
                </span>
                Radius from Vashi Hub:
              </span>
              <span className="text-primary font-bold">{searchRadiusKm} km radius</span>
            </div>
            <input
              type="range"
              min="5"
              max="75"
              step="5"
              value={searchRadiusKm}
              onChange={(e) => setSearchRadiusKm(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-1.5 bg-surface-container rounded-lg"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-3 px-3 rounded-2xl bg-surface-container-lowest border border-surface-container-high font-label-md text-on-surface focus:outline-none cursor-pointer shadow-xs"
            >
              <option value="fresh">Freshly Harvested</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="distance">Distance: Closest</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Produce' },
            { id: 'vegetables', label: 'Vegetables (Onions, Tomatoes)' },
            { id: 'grains', label: 'Grains & Cereals (Wheat, Rice)' },
            { id: 'pulses', label: 'Pulses & Dal (Toor, Chana)' },
            { id: 'fruits', label: 'Fruits & Berries' },
            { id: 'spices', label: 'Spices & Oilseeds' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-label-md transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Strip */}
      <div className="relative rounded-3xl overflow-hidden border border-surface-container-high shadow-md bg-surface-container">
        <img
          src={mapStripUrl}
          alt="Map of agro clusters and verified farmer farm gates"
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent p-6 flex flex-col justify-between text-white">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-secondary text-white font-label-sm font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Vashi Wholesale APMC Base
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-label-sm font-semibold">
                18 Verified Farm-Gates in {searchRadiusKm} km Radius
              </span>
            </div>
            <button
              onClick={() => {
                const elm = document.getElementById('escrow-order-drawer');
                elm?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-xl bg-primary text-white font-label-sm font-bold hover:bg-primary/90 flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              Zero-Dalali Escrow Active
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">
                RP
              </span>
              <div>
                <span className="font-label-md font-bold block leading-tight">
                  Ramesh Patil (14.2 km)
                </span>
                <span className="font-body-sm text-white/80 text-xs">
                  Garwa Onions • 150 Qtl Available
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold text-xs">
                BS
              </span>
              <div>
                <span className="font-label-md font-bold block leading-tight">
                  Balasaheb Shinde (21 km)
                </span>
                <span className="font-body-sm text-white/80 text-xs">
                  Himsona Tomatoes • 350 Crates
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Crop Cards + Sticky Order Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Crop Lot Cards */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-2xl font-bold text-on-surface flex items-center gap-2">
              <span>Direct Harvest Lots</span>
              <span className="text-on-surface-variant font-normal text-base">
                ({filteredLots.length} available)
              </span>
            </h2>
            <span className="font-label-sm text-on-surface-variant">
              Showing verified lots within {searchRadiusKm} km
            </span>
          </div>

          {filteredLots.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-surface-container-high space-y-3">
              <span className="material-symbols-outlined text-on-surface-variant text-[48px]">
                search_off
              </span>
              <h3 className="font-title-lg font-bold text-on-surface">No harvest lots found</h3>
              <p className="font-body-md text-on-surface-variant">
                Try widening your search radius slider or clearing the category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSearchRadiusKm(50);
                }}
                className="px-4 py-2 bg-primary text-on-primary rounded-xl font-label-md font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredLots.map((lot) => {
              const isSelected = activeLotId === lot.id;
              return (
                <div
                  key={lot.id}
                  className={`rounded-3xl bg-surface-container-lowest border-2 transition-all p-6 shadow-sm space-y-5 ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 shadow-md'
                      : 'border-surface-container-high hover:border-primary/40'
                  }`}
                >
                  {/* Card Top: Batch & Farmer info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-label-sm font-bold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                          {lot.batchCode}
                        </span>
                        {lot.isHighDemand && (
                          <span className="font-label-sm font-bold px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed">
                            High Demand Crop
                          </span>
                        )}
                      </div>
                      <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-1">
                        {lot.title}
                      </h3>
                      <p className="font-body-sm text-primary font-medium">{lot.variety}</p>
                    </div>

                    {/* Farmer Details */}
                    <div className="sm:text-right">
                      <div className="flex sm:justify-end items-center gap-1 text-on-surface font-title-md font-bold">
                        <span>{lot.farmerName}</span>
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          verified
                        </span>
                      </div>
                      <p className="font-body-sm text-on-surface-variant">
                        {lot.farmerLocation} • <strong className="text-secondary">{lot.distanceKm} km away</strong>
                      </p>
                      <div className="flex sm:justify-end items-center gap-1.5 text-xs text-on-surface-variant">
                        <span className="text-amber-500 font-bold">★ {lot.rating}</span>
                        <span>({lot.dealsCount} direct deals)</span>
                      </div>
                    </div>
                  </div>

                  {/* 5-Photo Proof Gallery Strip */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-on-surface-variant uppercase tracking-wider font-bold">
                        Mandatory 5-Photo Proof of Harvest:
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCropForModal(lot);
                          setIsInspectionModalOpen(true);
                        }}
                        className="font-label-sm text-primary font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        Inspect High-Res Photos
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {lot.photos.map((photo, pIdx) => (
                        <div
                          key={pIdx}
                          onClick={() => {
                            setSelectedCropForModal(lot);
                            setIsInspectionModalOpen(true);
                          }}
                          className="group relative aspect-square rounded-xl overflow-hidden bg-surface-container border border-surface-container-high cursor-pointer hover:border-primary transition-all"
                        >
                          <img
                            src={photo.url}
                            alt={photo.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[20px]">
                              zoom_in
                            </span>
                          </div>
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-[10px] text-white font-medium truncate text-center">
                            {photo.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Value Analysis Bar */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <span className="font-label-sm text-on-surface-variant block">
                          Direct Farm Gate Price
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-currency-display text-3xl font-black text-primary">
                            ₹{lot.pricePerUnit.toLocaleString('en-IN')}
                          </span>
                          <span className="font-title-md text-on-surface-variant">
                            / {lot.unit}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-label-sm text-on-surface-variant block">
                          Vashi APMC Mandi Avg
                        </span>
                        <div className="flex items-baseline gap-2 justify-end">
                          <span className="font-title-lg line-through text-on-surface-variant/80">
                            ₹{lot.apmcAvgPrice}
                          </span>
                          <span className="font-label-md font-bold text-[#0c5216] bg-primary-fixed px-2 py-0.5 rounded-full">
                            Save ₹{lot.apmcAvgPrice - lot.pricePerUnit}/Qtl
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Safe Trade Zone Visual Slider Indicator */}
                    <div>
                      <div className="flex justify-between text-xs text-on-surface-variant mb-1 font-medium">
                        <span>Govt MSP: ₹{lot.mspPrice}</span>
                        <span className="text-primary font-bold">Fair Trade Zone (₹{lot.safeMin} – ₹{lot.safeMax})</span>
                        <span>Ceiling: ₹{lot.ceilingPrice}</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-surface-container relative overflow-hidden">
                        <div
                          className="absolute h-full bg-primary-fixed-dim"
                          style={{
                            left: `${((lot.safeMin - lot.mspPrice) / (lot.ceilingPrice - lot.mspPrice)) * 100}%`,
                            width: `${((lot.safeMax - lot.safeMin) / (lot.ceilingPrice - lot.mspPrice)) * 100}%`,
                          }}
                        />
                        <div
                          className="absolute top-0 bottom-0 w-3 -ml-1.5 bg-primary rounded-full shadow-sm"
                          style={{
                            left: `${((lot.pricePerUnit - lot.mspPrice) / (lot.ceilingPrice - lot.mspPrice)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stock & Transit Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                      <span className="text-on-surface-variant block">Available Stock</span>
                      <strong className="text-on-surface text-sm">{lot.availableStock}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                      <span className="text-on-surface-variant block">Minimum Order (MOQ)</span>
                      <strong className="text-on-surface text-sm">{lot.minOrderQty}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                      <span className="text-on-surface-variant block">Packaging</span>
                      <strong className="text-on-surface text-sm">{lot.packaging}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container">
                      <span className="text-on-surface-variant block">Curing & Harvest</span>
                      <strong className="text-secondary text-sm">{lot.harvestDateText}</strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={() => {
                        setActiveLotId(lot.id);
                        setCartQuantityQtl(50);
                        const drawer = document.getElementById('escrow-order-drawer');
                        drawer?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`flex-1 py-3 px-4 rounded-xl font-label-md font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-primary text-on-primary shadow-md'
                          : 'bg-primary-container text-on-primary hover:bg-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      Select Lot & Lock Escrow (₹{lot.pricePerUnit * 50}/50 Qtl)
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCropForModal(lot);
                        setIsInspectionModalOpen(true);
                      }}
                      className="py-3 px-4 rounded-xl border border-surface-container-high font-label-md text-on-surface hover:bg-surface-container flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">biotech</span>
                      Moisture & Lab Inspection
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Sticky Column: Order Summary & Digital Escrow Drawer */}
        <div className="lg:col-span-4 sticky top-24 space-y-6" id="escrow-order-drawer">
          <div className="rounded-3xl bg-surface-container-lowest border-2 border-primary/30 p-6 shadow-xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </span>
                <div>
                  <h3 className="font-title-md font-bold text-on-surface">
                    Digital Escrow Order
                  </h3>
                  <span className="font-label-sm text-primary font-semibold">
                    100% Buyer & Seller Protection
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm font-bold">
                T+1 Settlement
              </span>
            </div>

            {/* Selected Crop Summary */}
            <div className="p-3.5 bg-surface-container-low rounded-2xl border border-surface-container space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-title-md font-bold text-on-surface">
                    {currentActiveLot.title}
                  </h4>
                  <p className="font-body-sm text-on-surface-variant">
                    Farmer: <strong>{currentActiveLot.farmerName}</strong> ({currentActiveLot.farmerLocation})
                  </p>
                </div>
                <span className="font-title-lg font-black text-primary">
                  ₹{currentActiveLot.pricePerUnit}/Qtl
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface mb-1.5">
                  <span>Order Quantity (Quintals):</span>
                  <span className="font-bold text-primary">{cartQuantityQtl} Qtl ({cartQuantityQtl * 2} Bags)</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="20"
                    max="150"
                    step="5"
                    value={cartQuantityQtl}
                    onChange={(e) => setCartQuantityQtl(Number(e.target.value))}
                    className="flex-1 accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
                  />
                  <span className="w-14 text-center py-1 rounded-lg bg-surface-container-lowest border border-surface-container font-bold text-xs">
                    {cartQuantityQtl} Qtl
                  </span>
                </div>
              </div>
            </div>

            {/* Zero-Middleman Transparent Cost Breakdown */}
            <div className="space-y-2.5 font-body-sm text-on-surface">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Crop Cost (100% to Farmer):</span>
                <span className="font-semibold">₹{cropSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Struck-out Dalali Middleman */}
              <div className="flex justify-between text-xs items-center p-2 rounded-xl bg-primary-fixed/40">
                <span className="text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Mandi Broker Dalali:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="line-through text-on-surface-variant/80">₹{traditionalBrokerageCut.toLocaleString('en-IN')}</span>
                  <span className="font-bold text-[#00450d]">₹0 (Waived)</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  Eicher Pro Farm-Gate Freight ({currentActiveLot.distanceKm} km):
                </span>
                <span className="font-semibold">₹{transporterFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-on-surface-variant">Weighbridge & Escrow Insurance (0.8%):</span>
                <span className="font-semibold">₹{techFee.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-surface-container-high flex justify-between items-baseline">
                <span className="font-title-md font-bold">Total Payable in Escrow:</span>
                <span className="font-display-lg text-2xl font-black text-primary">
                  ₹{totalEscrowPayable.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Net Retailer Savings Badge */}
              <div className="p-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed text-xs font-bold flex items-center justify-between">
                <span>Your Savings vs Traditional Mandi:</span>
                <span className="text-sm font-black">+₹{totalRetailerSavings.toLocaleString('en-IN')} Saved</span>
              </div>
            </div>

            {/* Escrow & Direct UPI Payment CTAs */}
            <div className="space-y-2.5">
              <button
                onClick={handleLockEscrow}
                disabled={isEscrowLocked}
                className={`w-full py-3.5 rounded-xl font-label-lg font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all ${
                  isEscrowLocked
                    ? 'bg-primary-fixed text-primary cursor-default'
                    : 'bg-primary text-on-primary hover:bg-primary/90'
                }`}
                id="lock-escrow-checkout-btn"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isEscrowLocked ? 'task_alt' : 'verified_user'}
                </span>
                {isEscrowLocked
                  ? 'Escrow Locked & Truck Dispatched!'
                  : `Deposit ₹${totalEscrowPayable.toLocaleString('en-IN')} to Escrow`}
              </button>

              <button
                onClick={() => {
                  setUpiDetails({
                    vpa: 'ramesh.patil@sbi',
                    payeeName: `${currentActiveLot.farmerName} (Kisan)`,
                    amount: totalEscrowPayable,
                    transactionNote: `FarmSync Order ${currentActiveLot.id} - ${cartQuantityQtl} Qtl ${currentActiveLot.crop}`,
                    refId: currentActiveLot.id,
                    orderNumber: currentActiveLot.id,
                    cropDetails: `${cartQuantityQtl} Qtl ${currentActiveLot.title}`,
                  });
                  setIsUpiModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-primary/40 text-primary font-label-md font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                id="buy-crops-pay-upi-btn"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                Pay Farmer via Direct UPI QR (0% Surcharge)
              </button>

              <p className="font-body-sm text-[11px] text-center text-on-surface-variant">
                Direct NPCI UPI payment or RBI-licensed Escrow. Disbursed to {currentActiveLot.farmerName} at 0% broker fee.
              </p>
            </div>

            {checkoutSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-primary-fixed text-on-primary-fixed-variant text-xs space-y-1.5 animate-in fade-in">
                <div className="font-bold flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Order Placed Successfully!
                </div>
                <p>{checkoutSuccessMsg}</p>
                <button
                  onClick={() => onNavigate('farmer-dashboard-orders')}
                  className="font-bold underline text-primary pt-1 cursor-pointer block"
                >
                  View Order in Farmer & Retailer Tracker →
                </button>
              </div>
            )}
          </div>

          {/* Real-time Mandi Ticker Card */}
          <div className="rounded-3xl bg-surface-container-lowest border border-surface-container-high p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-title-md font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">
                  show_chart
                </span>
                Vashi APMC Mandi Ticker
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-surface-container">
                <span className="text-on-surface font-medium">Garwa Red Onions</span>
                <span className="font-bold text-primary">₹2,450 (-₹200 vs APMC)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-surface-container">
                <span className="text-on-surface font-medium">Sharbati MP Wheat</span>
                <span className="font-bold text-primary">₹2,880 (-₹240 vs APMC)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface font-medium">Himsona Tomatoes</span>
                <span className="font-bold text-primary">₹18.50/kg (-₹3.50 vs APMC)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedCropForModal && (
        <InspectionModal
          isOpen={isInspectionModalOpen}
          onClose={() => setIsInspectionModalOpen(false)}
          onLockEscrow={() => {
            setActiveLotId(selectedCropForModal.id);
            setIsEscrowLocked(true);
            setCheckoutSuccessMsg(
              `Escrow locked for ${selectedCropForModal.title}. Funds safely parked.`
            );
          }}
        />
      )}

      {/* UPI QR Payment Modal for Retailer */}
      <UpiPaymentQrModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        initialDetails={upiDetails}
        role="retailer"
        onPaymentSuccess={(utr, amount) => {
          setIsEscrowLocked(true);
          setCheckoutSuccessMsg(
            `Direct UPI Payment of ₹${amount.toLocaleString(
              'en-IN'
            )} verified! UTR: ${utr}. Dispatched to ${currentActiveLot.farmerName} with 0% gateway cut.`
          );
        }}
      />
    </div>
  );
};

