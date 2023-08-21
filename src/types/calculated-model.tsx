export interface ICalculatedModel {
  intrinsicValue: number;
  differencePercentage: number;
  acceptableBuyPrice: number;
  belowIntrinsicValue: boolean;
  plValutation: number;
}

export const defaultIntrinsicValue: ICalculatedModel = {
  intrinsicValue: 0,
  differencePercentage: 0,
  acceptableBuyPrice: 0,
  belowIntrinsicValue: false,
  plValutation: 0,
};
