// https://tools.ietf.org/htm./rfc2234#section-6.1
import {createTokenizerFromNormalizedRuleList} from '../createTokenizer';
import {normalizeNBNF} from '../normalizeNBNF';

export const RFC2234Rules = normalizeNBNF(`
ALPHA  = %x41-5A / %x61-7A
BIT    = "0" / "1"
CHAR   = %x01-7F
CR     = %x0D
CRLF   = CR LF
CTL    = %x00-1F / %x7F
DIGIT  = %x30-39
DQUOTE = %x22
HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
HTAB   = %x09
LF     = %x0A
LWSP   = *(WSP / CRLF WSP)
OCTET  = %x00-FF
SP     = %x20
VCHAR  = %x21-7E
WSP    = SP / HTAB
`);

export const parseRFC2234 = createTokenizerFromNormalizedRuleList(RFC2234Rules);
