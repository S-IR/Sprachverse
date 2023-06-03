export const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export type LanguageLevel = (typeof languageLevels)[number];
export const LANGUAGE_CODES = [
  `ab`,
  `aa`,
  `af`,
  `ak`,
  `sq`,
  `am`,
  `ar`,
  `an`,
  `hy`,
  `as`,
  `av`,
  `ae`,
  `ay`,
  `az`,
  `bm`,
  `ba`,
  `eu`,
  `be`,
  `bn`,
  `bh`,
  `bi`,
  `bs`,
  `br`,
  `bg`,
  `my`,
  `ca`,
  `ch`,
  `ce`,
  `zh`,
  `zh-Hans`,
  `zh-Hant`,
  `cv`,
  `kw`,
  `co`,
  `cr`,
  `hr`,
  `cs`,
  `da`,
  `nl`,
  `dz`,
  `en`,
  `eo`,
  `et`,
  `ee`,
  `fo`,
  `fj`,
  `fi`,
  `fr`,
  `gl`,
  `gd`,
  `gv`,
  `ka`,
  `de`,
  `el`,
  `kl`,
  `gn`,
  `gu`,
  `ha`,
  `he`,
  `hz`,
  `hi`,
  `hu`,
  `is`,
  `io`,
  `ig`,
  `id`,
  `in`,
  `ia`,
  `ie`,
  `iu`,
  `ik`,
  `ga`,
  `it`,
  `ja`,
  `jv`,
  `kn`,
  `kr`,
  `ks`,
  `kk`,
  `km`,
  `ki`,
  `rw`,
  `rn`,
  `ky`,
  `kv`,
  `kg`,
  `ko`,
  `ku`,
  `kj`,
  `lo`,
  `la`,
  `lv`,
  `li`,
  `ln`,
  `lt`,
  `lb`,
  `gv`,
  `mk`,
  `mg`,
  `ms`,
  `ml`,
  `mt`,
  `mi`,
  `mr`,
  `mh`,
  `mo`,
  `mn`,
  `na`,
  `nv`,
  `ng`,
  `ne`,
  `no`,
  `ii`,
  `oc`,
  `oj`,
  `or`,
  `om`,
  `os`,
  `pi`,
  `fa`,
  `pl`,
  `pt`,
  `pa`,
  `qu`,
  `rm`,
  `ro`,
  `ru`,
  `se`,
  `sm`,
  `sg`,
  `sa`,
  `sr`,
  `st`,
  `tn`,
  `sn`,
  `sd`,
  `si`,
  `ss`,
  `sk`,
  `sl`,
  `so`,
  `es`,
  `su`,
  `sw`,
  `ss`,
  `sv`,
  `tl`,
  `ty`,
  `tg`,
  `ta`,
  `tt`,
  `te`,
  `th`,
  `bo`,
  `ti`,
  `to`,
  `ts`,
  `tr`,
  `tk`,
  `tw`,
  `ug`,
  `uk`,
  `ur`,
  `uz`,
  `ve`,
  `vi`,
  `vo`,
  `wa`,
  `cy`,
  `wo`,
  `xh`,
  `yi`,
  `ji`,
  `yo`,
  `zu`,
] as const;
