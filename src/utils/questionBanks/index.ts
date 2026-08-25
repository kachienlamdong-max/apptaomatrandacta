import { SubjectQuestionBank } from './bankTypes';
import { TOAN_BANK } from './toanBank';
import { VAN_BANK } from './vanBank';
import { TIENG_ANH_BANK } from './tiengAnhBank';
import { VAT_LI_BANK } from './vatLiBank';
import { HOA_HOC_BANK } from './hoaHocBank';
import { SINH_HOC_BANK } from './sinhHocBank';
import { DIA_LI_BANK } from './diaLiBank';
import { LICH_SU_BANK } from './lichSuBank';
import { GDKT_PL_BANK } from './gdktPlBank';
import { TIN_HOC_BANK } from './tinHocBank';
import { CONG_NGHE_BANK } from './congNgheBank';

export function getQuestionBankForSubject(subjectKey: string): SubjectQuestionBank {
  switch (subjectKey) {
    case 'toan':
      return TOAN_BANK;
    case 'ngu-van':
      return VAN_BANK;
    case 'tieng-anh':
      return TIENG_ANH_BANK;
    case 'vat-li':
      return VAT_LI_BANK;
    case 'hoa-hoc':
      return HOA_HOC_BANK;
    case 'sinh-hoc':
      return SINH_HOC_BANK;
    case 'dia-li':
      return DIA_LI_BANK;
    case 'lich-su':
      return LICH_SU_BANK;
    case 'gdkt-pl':
      return GDKT_PL_BANK;
    case 'tin-hoc':
      return TIN_HOC_BANK;
    case 'cong-nghe':
    case 'khtn':
    case 'lich-su-dia-li':
      return CONG_NGHE_BANK;
    default:
      return DIA_LI_BANK;
  }
}

export * from './bankTypes';
