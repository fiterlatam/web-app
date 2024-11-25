export class FormfieldBase {

  controlType: string;
  controlName: string;
  label: string;
  value: any;
  required: boolean;
  order: number;
  controlLength: number;
  options: any;
  type: string;

  constructor(options: {
              controlType?: string,
              controlName?: string,
              label?: string,
              value?: any,
              required?: boolean,
              order?: number,
              controlLength?: number,
              type?: string
    } = {}) {
      this.controlType = options.controlType || '';
      this.controlName = options.controlName || '';
      this.label = options.label || '';
      this.value = options.value === undefined ? '' : options.value;
      this.required = options.required;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlLength =  options.controlLength || 255;
      this.type = options.type;
  }

}
