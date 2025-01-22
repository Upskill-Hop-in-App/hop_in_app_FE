export interface DistrictResponse {
    distrito: string
    municipios: Municipio[]
  }
  
 export interface Municipio {
    nome: string
    codigoine: string
  }
  
 export interface MunicipioFreguesiaResponse {
    nome: string
    freguesias: string[]
  }