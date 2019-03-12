import {IntervalR} from './types';

export const intersectionIntervalR = (...IntervalRs: Array<IntervalR>): IntervalR | null => {
    const nextIntervalR = IntervalRs.shift();
    if (!nextIntervalR) {
        return null;
    }
    let [leftInclusiveFlag, leftEnd, rightEnd, rightInclusiveFlag] = nextIntervalR;
    while (1) {
        const nextIntervalR = IntervalRs.shift();
        if (!nextIntervalR) {
            break;
        }
        const [lFlag, lEnd, rEnd, rFlag] = nextIntervalR;
        if (leftEnd < lEnd) {
            leftEnd = lEnd;
            leftInclusiveFlag = lFlag;
        } else if (leftEnd === lEnd) {
            leftInclusiveFlag = leftInclusiveFlag && lFlag;
        }
        if (rEnd < rightEnd) {
            rightEnd = rEnd;
            rightInclusiveFlag = rFlag;
        } else if (rEnd === rightEnd) {
            rightInclusiveFlag = rightInclusiveFlag && rFlag;
        }
        if (rightEnd < leftEnd || (rightEnd === leftEnd && !(leftInclusiveFlag && rightInclusiveFlag))) {
            return null;
        }
    }
    return [leftInclusiveFlag, leftEnd, rightEnd, rightInclusiveFlag];
};
