// https://tools.ietf.org/html/rfc1034#section-3.5
import {createTokenizerFromNormalizedRuleList} from '../createTokenizer';
import {normalizeNBNF} from '../normalizeNBNF';
import {normalizeRuleList} from '../normalize/RuleList';

export let RFC1034Rules = normalizeNBNF(`
domain      = label *("." label)
label       = letter [[lgh-str] let-dig]
lgh-str     = 1*let-dig-hyp
let-dig-hyp = let-dig / "-"
let-dig     = letter / digit
letter      = %x41-5A / %x61-7A
digit       = %x30-39
`);

RFC1034Rules = normalizeRuleList(RFC1034Rules, {
    ...RFC1034Rules,
    label: null,
});

export const parseRFC1034 = createTokenizerFromNormalizedRuleList(RFC1034Rules);
