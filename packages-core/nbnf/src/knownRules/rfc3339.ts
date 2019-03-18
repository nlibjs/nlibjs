// https://tools.ietf.org/htm./rfc3339#section-5.6
import {createTokenizerFromNormalizedRuleList} from '../createTokenizer';
import {normalizeNBNF} from '../normalizeNBNF';
import {RFC2234Rules} from './rfc2234';

export const RFC3339Rules = normalizeNBNF(`
date-fullyear  = 4DIGIT
date-month     = 2DIGIT  ; 01-12
date-mday      = 2DIGIT  ; 01-28, 01-29, 01-30, 01-31 based on
                          ; month/year
time-hour      = 2DIGIT  ; 00-23
time-minute    = 2DIGIT  ; 00-59
time-second    = 2DIGIT  ; 00-58, 00-59, 00-60 based on leap second
                          ; rules
time-secfrac   = "." 1*DIGIT
time-numoffset = ("+" / "-") time-hour ":" time-minute
time-offset    = "Z" / time-numoffset
partial-time   = time-hour ":" time-minute ":" time-second
                  [time-secfrac]
full-date      = date-fullyear "-" date-month "-" date-mday
full-time      = partial-time time-offset
date-time      = full-date "T" full-time
`, {expands: RFC2234Rules});

export const parseRFC3339 = createTokenizerFromNormalizedRuleList(RFC3339Rules);
