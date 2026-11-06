import * as api from '@lp-labs/ciede2000-distance';
import { deltaE2000 } from '@lp-labs/ciede2000-distance';
const difference = deltaE2000({ L: 50, a: 2.6772, b: -79.7751 }, { L: 50, a: 0, b: -82.7485 });
if (Math.abs(difference - 2.0425) > 0.0001) throw new Error('Reference pair mismatch');
// @ts-expect-error invalid argument must be rejected by declarations
api.deltaE2000({ L: 'bad', a: 0, b: 0 }, { L: 0, a: 0, b: 0 });
