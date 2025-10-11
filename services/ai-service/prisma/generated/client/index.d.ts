
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model PricingLog
 * 
 */
export type PricingLog = $Result.DefaultSelection<Prisma.$PricingLogPayload>
/**
 * Model PricingConfig
 * 
 */
export type PricingConfig = $Result.DefaultSelection<Prisma.$PricingConfigPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more PricingLogs
 * const pricingLogs = await prisma.pricingLog.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more PricingLogs
   * const pricingLogs = await prisma.pricingLog.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.pricingLog`: Exposes CRUD operations for the **PricingLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PricingLogs
    * const pricingLogs = await prisma.pricingLog.findMany()
    * ```
    */
  get pricingLog(): Prisma.PricingLogDelegate<ExtArgs>;

  /**
   * `prisma.pricingConfig`: Exposes CRUD operations for the **PricingConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PricingConfigs
    * const pricingConfigs = await prisma.pricingConfig.findMany()
    * ```
    */
  get pricingConfig(): Prisma.PricingConfigDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    PricingLog: 'PricingLog',
    PricingConfig: 'PricingConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "pricingLog" | "pricingConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      PricingLog: {
        payload: Prisma.$PricingLogPayload<ExtArgs>
        fields: Prisma.PricingLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PricingLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PricingLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload>
          }
          findFirst: {
            args: Prisma.PricingLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PricingLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload>
          }
          findMany: {
            args: Prisma.PricingLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload>[]
          }
          create: {
            args: Prisma.PricingLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload>
          }
          createMany: {
            args: Prisma.PricingLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PricingLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload>[]
          }
          delete: {
            args: Prisma.PricingLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload>
          }
          update: {
            args: Prisma.PricingLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload>
          }
          deleteMany: {
            args: Prisma.PricingLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PricingLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PricingLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingLogPayload>
          }
          aggregate: {
            args: Prisma.PricingLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePricingLog>
          }
          groupBy: {
            args: Prisma.PricingLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<PricingLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.PricingLogCountArgs<ExtArgs>
            result: $Utils.Optional<PricingLogCountAggregateOutputType> | number
          }
        }
      }
      PricingConfig: {
        payload: Prisma.$PricingConfigPayload<ExtArgs>
        fields: Prisma.PricingConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PricingConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PricingConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload>
          }
          findFirst: {
            args: Prisma.PricingConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PricingConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload>
          }
          findMany: {
            args: Prisma.PricingConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload>[]
          }
          create: {
            args: Prisma.PricingConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload>
          }
          createMany: {
            args: Prisma.PricingConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PricingConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload>[]
          }
          delete: {
            args: Prisma.PricingConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload>
          }
          update: {
            args: Prisma.PricingConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload>
          }
          deleteMany: {
            args: Prisma.PricingConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PricingConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PricingConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PricingConfigPayload>
          }
          aggregate: {
            args: Prisma.PricingConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePricingConfig>
          }
          groupBy: {
            args: Prisma.PricingConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<PricingConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.PricingConfigCountArgs<ExtArgs>
            result: $Utils.Optional<PricingConfigCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model PricingLog
   */

  export type AggregatePricingLog = {
    _count: PricingLogCountAggregateOutputType | null
    _avg: PricingLogAvgAggregateOutputType | null
    _sum: PricingLogSumAggregateOutputType | null
    _min: PricingLogMinAggregateOutputType | null
    _max: PricingLogMaxAggregateOutputType | null
  }

  export type PricingLogAvgAggregateOutputType = {
    price: number | null
  }

  export type PricingLogSumAggregateOutputType = {
    price: number | null
  }

  export type PricingLogMinAggregateOutputType = {
    id: string | null
    tripId: string | null
    price: number | null
    strategy: string | null
    createdAt: Date | null
  }

  export type PricingLogMaxAggregateOutputType = {
    id: string | null
    tripId: string | null
    price: number | null
    strategy: string | null
    createdAt: Date | null
  }

  export type PricingLogCountAggregateOutputType = {
    id: number
    tripId: number
    inputs: number
    price: number
    strategy: number
    createdAt: number
    _all: number
  }


  export type PricingLogAvgAggregateInputType = {
    price?: true
  }

  export type PricingLogSumAggregateInputType = {
    price?: true
  }

  export type PricingLogMinAggregateInputType = {
    id?: true
    tripId?: true
    price?: true
    strategy?: true
    createdAt?: true
  }

  export type PricingLogMaxAggregateInputType = {
    id?: true
    tripId?: true
    price?: true
    strategy?: true
    createdAt?: true
  }

  export type PricingLogCountAggregateInputType = {
    id?: true
    tripId?: true
    inputs?: true
    price?: true
    strategy?: true
    createdAt?: true
    _all?: true
  }

  export type PricingLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PricingLog to aggregate.
     */
    where?: PricingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricingLogs to fetch.
     */
    orderBy?: PricingLogOrderByWithRelationInput | PricingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PricingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PricingLogs
    **/
    _count?: true | PricingLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PricingLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PricingLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PricingLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PricingLogMaxAggregateInputType
  }

  export type GetPricingLogAggregateType<T extends PricingLogAggregateArgs> = {
        [P in keyof T & keyof AggregatePricingLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePricingLog[P]>
      : GetScalarType<T[P], AggregatePricingLog[P]>
  }




  export type PricingLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PricingLogWhereInput
    orderBy?: PricingLogOrderByWithAggregationInput | PricingLogOrderByWithAggregationInput[]
    by: PricingLogScalarFieldEnum[] | PricingLogScalarFieldEnum
    having?: PricingLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PricingLogCountAggregateInputType | true
    _avg?: PricingLogAvgAggregateInputType
    _sum?: PricingLogSumAggregateInputType
    _min?: PricingLogMinAggregateInputType
    _max?: PricingLogMaxAggregateInputType
  }

  export type PricingLogGroupByOutputType = {
    id: string
    tripId: string
    inputs: JsonValue
    price: number
    strategy: string
    createdAt: Date
    _count: PricingLogCountAggregateOutputType | null
    _avg: PricingLogAvgAggregateOutputType | null
    _sum: PricingLogSumAggregateOutputType | null
    _min: PricingLogMinAggregateOutputType | null
    _max: PricingLogMaxAggregateOutputType | null
  }

  type GetPricingLogGroupByPayload<T extends PricingLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PricingLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PricingLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PricingLogGroupByOutputType[P]>
            : GetScalarType<T[P], PricingLogGroupByOutputType[P]>
        }
      >
    >


  export type PricingLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tripId?: boolean
    inputs?: boolean
    price?: boolean
    strategy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pricingLog"]>

  export type PricingLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tripId?: boolean
    inputs?: boolean
    price?: boolean
    strategy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["pricingLog"]>

  export type PricingLogSelectScalar = {
    id?: boolean
    tripId?: boolean
    inputs?: boolean
    price?: boolean
    strategy?: boolean
    createdAt?: boolean
  }


  export type $PricingLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PricingLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tripId: string
      inputs: Prisma.JsonValue
      price: number
      strategy: string
      createdAt: Date
    }, ExtArgs["result"]["pricingLog"]>
    composites: {}
  }

  type PricingLogGetPayload<S extends boolean | null | undefined | PricingLogDefaultArgs> = $Result.GetResult<Prisma.$PricingLogPayload, S>

  type PricingLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PricingLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PricingLogCountAggregateInputType | true
    }

  export interface PricingLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PricingLog'], meta: { name: 'PricingLog' } }
    /**
     * Find zero or one PricingLog that matches the filter.
     * @param {PricingLogFindUniqueArgs} args - Arguments to find a PricingLog
     * @example
     * // Get one PricingLog
     * const pricingLog = await prisma.pricingLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PricingLogFindUniqueArgs>(args: SelectSubset<T, PricingLogFindUniqueArgs<ExtArgs>>): Prisma__PricingLogClient<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PricingLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PricingLogFindUniqueOrThrowArgs} args - Arguments to find a PricingLog
     * @example
     * // Get one PricingLog
     * const pricingLog = await prisma.pricingLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PricingLogFindUniqueOrThrowArgs>(args: SelectSubset<T, PricingLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PricingLogClient<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PricingLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingLogFindFirstArgs} args - Arguments to find a PricingLog
     * @example
     * // Get one PricingLog
     * const pricingLog = await prisma.pricingLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PricingLogFindFirstArgs>(args?: SelectSubset<T, PricingLogFindFirstArgs<ExtArgs>>): Prisma__PricingLogClient<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PricingLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingLogFindFirstOrThrowArgs} args - Arguments to find a PricingLog
     * @example
     * // Get one PricingLog
     * const pricingLog = await prisma.pricingLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PricingLogFindFirstOrThrowArgs>(args?: SelectSubset<T, PricingLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__PricingLogClient<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PricingLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PricingLogs
     * const pricingLogs = await prisma.pricingLog.findMany()
     * 
     * // Get first 10 PricingLogs
     * const pricingLogs = await prisma.pricingLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pricingLogWithIdOnly = await prisma.pricingLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PricingLogFindManyArgs>(args?: SelectSubset<T, PricingLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PricingLog.
     * @param {PricingLogCreateArgs} args - Arguments to create a PricingLog.
     * @example
     * // Create one PricingLog
     * const PricingLog = await prisma.pricingLog.create({
     *   data: {
     *     // ... data to create a PricingLog
     *   }
     * })
     * 
     */
    create<T extends PricingLogCreateArgs>(args: SelectSubset<T, PricingLogCreateArgs<ExtArgs>>): Prisma__PricingLogClient<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PricingLogs.
     * @param {PricingLogCreateManyArgs} args - Arguments to create many PricingLogs.
     * @example
     * // Create many PricingLogs
     * const pricingLog = await prisma.pricingLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PricingLogCreateManyArgs>(args?: SelectSubset<T, PricingLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PricingLogs and returns the data saved in the database.
     * @param {PricingLogCreateManyAndReturnArgs} args - Arguments to create many PricingLogs.
     * @example
     * // Create many PricingLogs
     * const pricingLog = await prisma.pricingLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PricingLogs and only return the `id`
     * const pricingLogWithIdOnly = await prisma.pricingLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PricingLogCreateManyAndReturnArgs>(args?: SelectSubset<T, PricingLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PricingLog.
     * @param {PricingLogDeleteArgs} args - Arguments to delete one PricingLog.
     * @example
     * // Delete one PricingLog
     * const PricingLog = await prisma.pricingLog.delete({
     *   where: {
     *     // ... filter to delete one PricingLog
     *   }
     * })
     * 
     */
    delete<T extends PricingLogDeleteArgs>(args: SelectSubset<T, PricingLogDeleteArgs<ExtArgs>>): Prisma__PricingLogClient<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PricingLog.
     * @param {PricingLogUpdateArgs} args - Arguments to update one PricingLog.
     * @example
     * // Update one PricingLog
     * const pricingLog = await prisma.pricingLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PricingLogUpdateArgs>(args: SelectSubset<T, PricingLogUpdateArgs<ExtArgs>>): Prisma__PricingLogClient<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PricingLogs.
     * @param {PricingLogDeleteManyArgs} args - Arguments to filter PricingLogs to delete.
     * @example
     * // Delete a few PricingLogs
     * const { count } = await prisma.pricingLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PricingLogDeleteManyArgs>(args?: SelectSubset<T, PricingLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PricingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PricingLogs
     * const pricingLog = await prisma.pricingLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PricingLogUpdateManyArgs>(args: SelectSubset<T, PricingLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PricingLog.
     * @param {PricingLogUpsertArgs} args - Arguments to update or create a PricingLog.
     * @example
     * // Update or create a PricingLog
     * const pricingLog = await prisma.pricingLog.upsert({
     *   create: {
     *     // ... data to create a PricingLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PricingLog we want to update
     *   }
     * })
     */
    upsert<T extends PricingLogUpsertArgs>(args: SelectSubset<T, PricingLogUpsertArgs<ExtArgs>>): Prisma__PricingLogClient<$Result.GetResult<Prisma.$PricingLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PricingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingLogCountArgs} args - Arguments to filter PricingLogs to count.
     * @example
     * // Count the number of PricingLogs
     * const count = await prisma.pricingLog.count({
     *   where: {
     *     // ... the filter for the PricingLogs we want to count
     *   }
     * })
    **/
    count<T extends PricingLogCountArgs>(
      args?: Subset<T, PricingLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PricingLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PricingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PricingLogAggregateArgs>(args: Subset<T, PricingLogAggregateArgs>): Prisma.PrismaPromise<GetPricingLogAggregateType<T>>

    /**
     * Group by PricingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PricingLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PricingLogGroupByArgs['orderBy'] }
        : { orderBy?: PricingLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PricingLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPricingLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PricingLog model
   */
  readonly fields: PricingLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PricingLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PricingLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PricingLog model
   */ 
  interface PricingLogFieldRefs {
    readonly id: FieldRef<"PricingLog", 'String'>
    readonly tripId: FieldRef<"PricingLog", 'String'>
    readonly inputs: FieldRef<"PricingLog", 'Json'>
    readonly price: FieldRef<"PricingLog", 'Int'>
    readonly strategy: FieldRef<"PricingLog", 'String'>
    readonly createdAt: FieldRef<"PricingLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PricingLog findUnique
   */
  export type PricingLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
    /**
     * Filter, which PricingLog to fetch.
     */
    where: PricingLogWhereUniqueInput
  }

  /**
   * PricingLog findUniqueOrThrow
   */
  export type PricingLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
    /**
     * Filter, which PricingLog to fetch.
     */
    where: PricingLogWhereUniqueInput
  }

  /**
   * PricingLog findFirst
   */
  export type PricingLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
    /**
     * Filter, which PricingLog to fetch.
     */
    where?: PricingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricingLogs to fetch.
     */
    orderBy?: PricingLogOrderByWithRelationInput | PricingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PricingLogs.
     */
    cursor?: PricingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PricingLogs.
     */
    distinct?: PricingLogScalarFieldEnum | PricingLogScalarFieldEnum[]
  }

  /**
   * PricingLog findFirstOrThrow
   */
  export type PricingLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
    /**
     * Filter, which PricingLog to fetch.
     */
    where?: PricingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricingLogs to fetch.
     */
    orderBy?: PricingLogOrderByWithRelationInput | PricingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PricingLogs.
     */
    cursor?: PricingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PricingLogs.
     */
    distinct?: PricingLogScalarFieldEnum | PricingLogScalarFieldEnum[]
  }

  /**
   * PricingLog findMany
   */
  export type PricingLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
    /**
     * Filter, which PricingLogs to fetch.
     */
    where?: PricingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricingLogs to fetch.
     */
    orderBy?: PricingLogOrderByWithRelationInput | PricingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PricingLogs.
     */
    cursor?: PricingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricingLogs.
     */
    skip?: number
    distinct?: PricingLogScalarFieldEnum | PricingLogScalarFieldEnum[]
  }

  /**
   * PricingLog create
   */
  export type PricingLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
    /**
     * The data needed to create a PricingLog.
     */
    data: XOR<PricingLogCreateInput, PricingLogUncheckedCreateInput>
  }

  /**
   * PricingLog createMany
   */
  export type PricingLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PricingLogs.
     */
    data: PricingLogCreateManyInput | PricingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PricingLog createManyAndReturn
   */
  export type PricingLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PricingLogs.
     */
    data: PricingLogCreateManyInput | PricingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PricingLog update
   */
  export type PricingLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
    /**
     * The data needed to update a PricingLog.
     */
    data: XOR<PricingLogUpdateInput, PricingLogUncheckedUpdateInput>
    /**
     * Choose, which PricingLog to update.
     */
    where: PricingLogWhereUniqueInput
  }

  /**
   * PricingLog updateMany
   */
  export type PricingLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PricingLogs.
     */
    data: XOR<PricingLogUpdateManyMutationInput, PricingLogUncheckedUpdateManyInput>
    /**
     * Filter which PricingLogs to update
     */
    where?: PricingLogWhereInput
  }

  /**
   * PricingLog upsert
   */
  export type PricingLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
    /**
     * The filter to search for the PricingLog to update in case it exists.
     */
    where: PricingLogWhereUniqueInput
    /**
     * In case the PricingLog found by the `where` argument doesn't exist, create a new PricingLog with this data.
     */
    create: XOR<PricingLogCreateInput, PricingLogUncheckedCreateInput>
    /**
     * In case the PricingLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PricingLogUpdateInput, PricingLogUncheckedUpdateInput>
  }

  /**
   * PricingLog delete
   */
  export type PricingLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
    /**
     * Filter which PricingLog to delete.
     */
    where: PricingLogWhereUniqueInput
  }

  /**
   * PricingLog deleteMany
   */
  export type PricingLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PricingLogs to delete
     */
    where?: PricingLogWhereInput
  }

  /**
   * PricingLog without action
   */
  export type PricingLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingLog
     */
    select?: PricingLogSelect<ExtArgs> | null
  }


  /**
   * Model PricingConfig
   */

  export type AggregatePricingConfig = {
    _count: PricingConfigCountAggregateOutputType | null
    _avg: PricingConfigAvgAggregateOutputType | null
    _sum: PricingConfigSumAggregateOutputType | null
    _min: PricingConfigMinAggregateOutputType | null
    _max: PricingConfigMaxAggregateOutputType | null
  }

  export type PricingConfigAvgAggregateOutputType = {
    loadFactorT1: number | null
    loadFactorT2: number | null
    timeBandBoost: number | null
  }

  export type PricingConfigSumAggregateOutputType = {
    loadFactorT1: number | null
    loadFactorT2: number | null
    timeBandBoost: number | null
  }

  export type PricingConfigMinAggregateOutputType = {
    id: string | null
    loadFactorT1: number | null
    loadFactorT2: number | null
    timeBandBoost: number | null
    updatedAt: Date | null
  }

  export type PricingConfigMaxAggregateOutputType = {
    id: string | null
    loadFactorT1: number | null
    loadFactorT2: number | null
    timeBandBoost: number | null
    updatedAt: Date | null
  }

  export type PricingConfigCountAggregateOutputType = {
    id: number
    loadFactorT1: number
    loadFactorT2: number
    timeBandBoost: number
    updatedAt: number
    _all: number
  }


  export type PricingConfigAvgAggregateInputType = {
    loadFactorT1?: true
    loadFactorT2?: true
    timeBandBoost?: true
  }

  export type PricingConfigSumAggregateInputType = {
    loadFactorT1?: true
    loadFactorT2?: true
    timeBandBoost?: true
  }

  export type PricingConfigMinAggregateInputType = {
    id?: true
    loadFactorT1?: true
    loadFactorT2?: true
    timeBandBoost?: true
    updatedAt?: true
  }

  export type PricingConfigMaxAggregateInputType = {
    id?: true
    loadFactorT1?: true
    loadFactorT2?: true
    timeBandBoost?: true
    updatedAt?: true
  }

  export type PricingConfigCountAggregateInputType = {
    id?: true
    loadFactorT1?: true
    loadFactorT2?: true
    timeBandBoost?: true
    updatedAt?: true
    _all?: true
  }

  export type PricingConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PricingConfig to aggregate.
     */
    where?: PricingConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricingConfigs to fetch.
     */
    orderBy?: PricingConfigOrderByWithRelationInput | PricingConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PricingConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricingConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricingConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PricingConfigs
    **/
    _count?: true | PricingConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PricingConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PricingConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PricingConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PricingConfigMaxAggregateInputType
  }

  export type GetPricingConfigAggregateType<T extends PricingConfigAggregateArgs> = {
        [P in keyof T & keyof AggregatePricingConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePricingConfig[P]>
      : GetScalarType<T[P], AggregatePricingConfig[P]>
  }




  export type PricingConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PricingConfigWhereInput
    orderBy?: PricingConfigOrderByWithAggregationInput | PricingConfigOrderByWithAggregationInput[]
    by: PricingConfigScalarFieldEnum[] | PricingConfigScalarFieldEnum
    having?: PricingConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PricingConfigCountAggregateInputType | true
    _avg?: PricingConfigAvgAggregateInputType
    _sum?: PricingConfigSumAggregateInputType
    _min?: PricingConfigMinAggregateInputType
    _max?: PricingConfigMaxAggregateInputType
  }

  export type PricingConfigGroupByOutputType = {
    id: string
    loadFactorT1: number
    loadFactorT2: number
    timeBandBoost: number
    updatedAt: Date
    _count: PricingConfigCountAggregateOutputType | null
    _avg: PricingConfigAvgAggregateOutputType | null
    _sum: PricingConfigSumAggregateOutputType | null
    _min: PricingConfigMinAggregateOutputType | null
    _max: PricingConfigMaxAggregateOutputType | null
  }

  type GetPricingConfigGroupByPayload<T extends PricingConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PricingConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PricingConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PricingConfigGroupByOutputType[P]>
            : GetScalarType<T[P], PricingConfigGroupByOutputType[P]>
        }
      >
    >


  export type PricingConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loadFactorT1?: boolean
    loadFactorT2?: boolean
    timeBandBoost?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pricingConfig"]>

  export type PricingConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    loadFactorT1?: boolean
    loadFactorT2?: boolean
    timeBandBoost?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["pricingConfig"]>

  export type PricingConfigSelectScalar = {
    id?: boolean
    loadFactorT1?: boolean
    loadFactorT2?: boolean
    timeBandBoost?: boolean
    updatedAt?: boolean
  }


  export type $PricingConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PricingConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      loadFactorT1: number
      loadFactorT2: number
      timeBandBoost: number
      updatedAt: Date
    }, ExtArgs["result"]["pricingConfig"]>
    composites: {}
  }

  type PricingConfigGetPayload<S extends boolean | null | undefined | PricingConfigDefaultArgs> = $Result.GetResult<Prisma.$PricingConfigPayload, S>

  type PricingConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PricingConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PricingConfigCountAggregateInputType | true
    }

  export interface PricingConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PricingConfig'], meta: { name: 'PricingConfig' } }
    /**
     * Find zero or one PricingConfig that matches the filter.
     * @param {PricingConfigFindUniqueArgs} args - Arguments to find a PricingConfig
     * @example
     * // Get one PricingConfig
     * const pricingConfig = await prisma.pricingConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PricingConfigFindUniqueArgs>(args: SelectSubset<T, PricingConfigFindUniqueArgs<ExtArgs>>): Prisma__PricingConfigClient<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PricingConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PricingConfigFindUniqueOrThrowArgs} args - Arguments to find a PricingConfig
     * @example
     * // Get one PricingConfig
     * const pricingConfig = await prisma.pricingConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PricingConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, PricingConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PricingConfigClient<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PricingConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingConfigFindFirstArgs} args - Arguments to find a PricingConfig
     * @example
     * // Get one PricingConfig
     * const pricingConfig = await prisma.pricingConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PricingConfigFindFirstArgs>(args?: SelectSubset<T, PricingConfigFindFirstArgs<ExtArgs>>): Prisma__PricingConfigClient<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PricingConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingConfigFindFirstOrThrowArgs} args - Arguments to find a PricingConfig
     * @example
     * // Get one PricingConfig
     * const pricingConfig = await prisma.pricingConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PricingConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, PricingConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__PricingConfigClient<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PricingConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PricingConfigs
     * const pricingConfigs = await prisma.pricingConfig.findMany()
     * 
     * // Get first 10 PricingConfigs
     * const pricingConfigs = await prisma.pricingConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pricingConfigWithIdOnly = await prisma.pricingConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PricingConfigFindManyArgs>(args?: SelectSubset<T, PricingConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PricingConfig.
     * @param {PricingConfigCreateArgs} args - Arguments to create a PricingConfig.
     * @example
     * // Create one PricingConfig
     * const PricingConfig = await prisma.pricingConfig.create({
     *   data: {
     *     // ... data to create a PricingConfig
     *   }
     * })
     * 
     */
    create<T extends PricingConfigCreateArgs>(args: SelectSubset<T, PricingConfigCreateArgs<ExtArgs>>): Prisma__PricingConfigClient<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PricingConfigs.
     * @param {PricingConfigCreateManyArgs} args - Arguments to create many PricingConfigs.
     * @example
     * // Create many PricingConfigs
     * const pricingConfig = await prisma.pricingConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PricingConfigCreateManyArgs>(args?: SelectSubset<T, PricingConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PricingConfigs and returns the data saved in the database.
     * @param {PricingConfigCreateManyAndReturnArgs} args - Arguments to create many PricingConfigs.
     * @example
     * // Create many PricingConfigs
     * const pricingConfig = await prisma.pricingConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PricingConfigs and only return the `id`
     * const pricingConfigWithIdOnly = await prisma.pricingConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PricingConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, PricingConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PricingConfig.
     * @param {PricingConfigDeleteArgs} args - Arguments to delete one PricingConfig.
     * @example
     * // Delete one PricingConfig
     * const PricingConfig = await prisma.pricingConfig.delete({
     *   where: {
     *     // ... filter to delete one PricingConfig
     *   }
     * })
     * 
     */
    delete<T extends PricingConfigDeleteArgs>(args: SelectSubset<T, PricingConfigDeleteArgs<ExtArgs>>): Prisma__PricingConfigClient<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PricingConfig.
     * @param {PricingConfigUpdateArgs} args - Arguments to update one PricingConfig.
     * @example
     * // Update one PricingConfig
     * const pricingConfig = await prisma.pricingConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PricingConfigUpdateArgs>(args: SelectSubset<T, PricingConfigUpdateArgs<ExtArgs>>): Prisma__PricingConfigClient<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PricingConfigs.
     * @param {PricingConfigDeleteManyArgs} args - Arguments to filter PricingConfigs to delete.
     * @example
     * // Delete a few PricingConfigs
     * const { count } = await prisma.pricingConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PricingConfigDeleteManyArgs>(args?: SelectSubset<T, PricingConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PricingConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PricingConfigs
     * const pricingConfig = await prisma.pricingConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PricingConfigUpdateManyArgs>(args: SelectSubset<T, PricingConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PricingConfig.
     * @param {PricingConfigUpsertArgs} args - Arguments to update or create a PricingConfig.
     * @example
     * // Update or create a PricingConfig
     * const pricingConfig = await prisma.pricingConfig.upsert({
     *   create: {
     *     // ... data to create a PricingConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PricingConfig we want to update
     *   }
     * })
     */
    upsert<T extends PricingConfigUpsertArgs>(args: SelectSubset<T, PricingConfigUpsertArgs<ExtArgs>>): Prisma__PricingConfigClient<$Result.GetResult<Prisma.$PricingConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PricingConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingConfigCountArgs} args - Arguments to filter PricingConfigs to count.
     * @example
     * // Count the number of PricingConfigs
     * const count = await prisma.pricingConfig.count({
     *   where: {
     *     // ... the filter for the PricingConfigs we want to count
     *   }
     * })
    **/
    count<T extends PricingConfigCountArgs>(
      args?: Subset<T, PricingConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PricingConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PricingConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PricingConfigAggregateArgs>(args: Subset<T, PricingConfigAggregateArgs>): Prisma.PrismaPromise<GetPricingConfigAggregateType<T>>

    /**
     * Group by PricingConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PricingConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PricingConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PricingConfigGroupByArgs['orderBy'] }
        : { orderBy?: PricingConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PricingConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPricingConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PricingConfig model
   */
  readonly fields: PricingConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PricingConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PricingConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PricingConfig model
   */ 
  interface PricingConfigFieldRefs {
    readonly id: FieldRef<"PricingConfig", 'String'>
    readonly loadFactorT1: FieldRef<"PricingConfig", 'Int'>
    readonly loadFactorT2: FieldRef<"PricingConfig", 'Int'>
    readonly timeBandBoost: FieldRef<"PricingConfig", 'Int'>
    readonly updatedAt: FieldRef<"PricingConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PricingConfig findUnique
   */
  export type PricingConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
    /**
     * Filter, which PricingConfig to fetch.
     */
    where: PricingConfigWhereUniqueInput
  }

  /**
   * PricingConfig findUniqueOrThrow
   */
  export type PricingConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
    /**
     * Filter, which PricingConfig to fetch.
     */
    where: PricingConfigWhereUniqueInput
  }

  /**
   * PricingConfig findFirst
   */
  export type PricingConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
    /**
     * Filter, which PricingConfig to fetch.
     */
    where?: PricingConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricingConfigs to fetch.
     */
    orderBy?: PricingConfigOrderByWithRelationInput | PricingConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PricingConfigs.
     */
    cursor?: PricingConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricingConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricingConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PricingConfigs.
     */
    distinct?: PricingConfigScalarFieldEnum | PricingConfigScalarFieldEnum[]
  }

  /**
   * PricingConfig findFirstOrThrow
   */
  export type PricingConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
    /**
     * Filter, which PricingConfig to fetch.
     */
    where?: PricingConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricingConfigs to fetch.
     */
    orderBy?: PricingConfigOrderByWithRelationInput | PricingConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PricingConfigs.
     */
    cursor?: PricingConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricingConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricingConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PricingConfigs.
     */
    distinct?: PricingConfigScalarFieldEnum | PricingConfigScalarFieldEnum[]
  }

  /**
   * PricingConfig findMany
   */
  export type PricingConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
    /**
     * Filter, which PricingConfigs to fetch.
     */
    where?: PricingConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PricingConfigs to fetch.
     */
    orderBy?: PricingConfigOrderByWithRelationInput | PricingConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PricingConfigs.
     */
    cursor?: PricingConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PricingConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PricingConfigs.
     */
    skip?: number
    distinct?: PricingConfigScalarFieldEnum | PricingConfigScalarFieldEnum[]
  }

  /**
   * PricingConfig create
   */
  export type PricingConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a PricingConfig.
     */
    data: XOR<PricingConfigCreateInput, PricingConfigUncheckedCreateInput>
  }

  /**
   * PricingConfig createMany
   */
  export type PricingConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PricingConfigs.
     */
    data: PricingConfigCreateManyInput | PricingConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PricingConfig createManyAndReturn
   */
  export type PricingConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PricingConfigs.
     */
    data: PricingConfigCreateManyInput | PricingConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PricingConfig update
   */
  export type PricingConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a PricingConfig.
     */
    data: XOR<PricingConfigUpdateInput, PricingConfigUncheckedUpdateInput>
    /**
     * Choose, which PricingConfig to update.
     */
    where: PricingConfigWhereUniqueInput
  }

  /**
   * PricingConfig updateMany
   */
  export type PricingConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PricingConfigs.
     */
    data: XOR<PricingConfigUpdateManyMutationInput, PricingConfigUncheckedUpdateManyInput>
    /**
     * Filter which PricingConfigs to update
     */
    where?: PricingConfigWhereInput
  }

  /**
   * PricingConfig upsert
   */
  export type PricingConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the PricingConfig to update in case it exists.
     */
    where: PricingConfigWhereUniqueInput
    /**
     * In case the PricingConfig found by the `where` argument doesn't exist, create a new PricingConfig with this data.
     */
    create: XOR<PricingConfigCreateInput, PricingConfigUncheckedCreateInput>
    /**
     * In case the PricingConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PricingConfigUpdateInput, PricingConfigUncheckedUpdateInput>
  }

  /**
   * PricingConfig delete
   */
  export type PricingConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
    /**
     * Filter which PricingConfig to delete.
     */
    where: PricingConfigWhereUniqueInput
  }

  /**
   * PricingConfig deleteMany
   */
  export type PricingConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PricingConfigs to delete
     */
    where?: PricingConfigWhereInput
  }

  /**
   * PricingConfig without action
   */
  export type PricingConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PricingConfig
     */
    select?: PricingConfigSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PricingLogScalarFieldEnum: {
    id: 'id',
    tripId: 'tripId',
    inputs: 'inputs',
    price: 'price',
    strategy: 'strategy',
    createdAt: 'createdAt'
  };

  export type PricingLogScalarFieldEnum = (typeof PricingLogScalarFieldEnum)[keyof typeof PricingLogScalarFieldEnum]


  export const PricingConfigScalarFieldEnum: {
    id: 'id',
    loadFactorT1: 'loadFactorT1',
    loadFactorT2: 'loadFactorT2',
    timeBandBoost: 'timeBandBoost',
    updatedAt: 'updatedAt'
  };

  export type PricingConfigScalarFieldEnum = (typeof PricingConfigScalarFieldEnum)[keyof typeof PricingConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PricingLogWhereInput = {
    AND?: PricingLogWhereInput | PricingLogWhereInput[]
    OR?: PricingLogWhereInput[]
    NOT?: PricingLogWhereInput | PricingLogWhereInput[]
    id?: StringFilter<"PricingLog"> | string
    tripId?: StringFilter<"PricingLog"> | string
    inputs?: JsonFilter<"PricingLog">
    price?: IntFilter<"PricingLog"> | number
    strategy?: StringFilter<"PricingLog"> | string
    createdAt?: DateTimeFilter<"PricingLog"> | Date | string
  }

  export type PricingLogOrderByWithRelationInput = {
    id?: SortOrder
    tripId?: SortOrder
    inputs?: SortOrder
    price?: SortOrder
    strategy?: SortOrder
    createdAt?: SortOrder
  }

  export type PricingLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PricingLogWhereInput | PricingLogWhereInput[]
    OR?: PricingLogWhereInput[]
    NOT?: PricingLogWhereInput | PricingLogWhereInput[]
    tripId?: StringFilter<"PricingLog"> | string
    inputs?: JsonFilter<"PricingLog">
    price?: IntFilter<"PricingLog"> | number
    strategy?: StringFilter<"PricingLog"> | string
    createdAt?: DateTimeFilter<"PricingLog"> | Date | string
  }, "id">

  export type PricingLogOrderByWithAggregationInput = {
    id?: SortOrder
    tripId?: SortOrder
    inputs?: SortOrder
    price?: SortOrder
    strategy?: SortOrder
    createdAt?: SortOrder
    _count?: PricingLogCountOrderByAggregateInput
    _avg?: PricingLogAvgOrderByAggregateInput
    _max?: PricingLogMaxOrderByAggregateInput
    _min?: PricingLogMinOrderByAggregateInput
    _sum?: PricingLogSumOrderByAggregateInput
  }

  export type PricingLogScalarWhereWithAggregatesInput = {
    AND?: PricingLogScalarWhereWithAggregatesInput | PricingLogScalarWhereWithAggregatesInput[]
    OR?: PricingLogScalarWhereWithAggregatesInput[]
    NOT?: PricingLogScalarWhereWithAggregatesInput | PricingLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PricingLog"> | string
    tripId?: StringWithAggregatesFilter<"PricingLog"> | string
    inputs?: JsonWithAggregatesFilter<"PricingLog">
    price?: IntWithAggregatesFilter<"PricingLog"> | number
    strategy?: StringWithAggregatesFilter<"PricingLog"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PricingLog"> | Date | string
  }

  export type PricingConfigWhereInput = {
    AND?: PricingConfigWhereInput | PricingConfigWhereInput[]
    OR?: PricingConfigWhereInput[]
    NOT?: PricingConfigWhereInput | PricingConfigWhereInput[]
    id?: StringFilter<"PricingConfig"> | string
    loadFactorT1?: IntFilter<"PricingConfig"> | number
    loadFactorT2?: IntFilter<"PricingConfig"> | number
    timeBandBoost?: IntFilter<"PricingConfig"> | number
    updatedAt?: DateTimeFilter<"PricingConfig"> | Date | string
  }

  export type PricingConfigOrderByWithRelationInput = {
    id?: SortOrder
    loadFactorT1?: SortOrder
    loadFactorT2?: SortOrder
    timeBandBoost?: SortOrder
    updatedAt?: SortOrder
  }

  export type PricingConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PricingConfigWhereInput | PricingConfigWhereInput[]
    OR?: PricingConfigWhereInput[]
    NOT?: PricingConfigWhereInput | PricingConfigWhereInput[]
    loadFactorT1?: IntFilter<"PricingConfig"> | number
    loadFactorT2?: IntFilter<"PricingConfig"> | number
    timeBandBoost?: IntFilter<"PricingConfig"> | number
    updatedAt?: DateTimeFilter<"PricingConfig"> | Date | string
  }, "id">

  export type PricingConfigOrderByWithAggregationInput = {
    id?: SortOrder
    loadFactorT1?: SortOrder
    loadFactorT2?: SortOrder
    timeBandBoost?: SortOrder
    updatedAt?: SortOrder
    _count?: PricingConfigCountOrderByAggregateInput
    _avg?: PricingConfigAvgOrderByAggregateInput
    _max?: PricingConfigMaxOrderByAggregateInput
    _min?: PricingConfigMinOrderByAggregateInput
    _sum?: PricingConfigSumOrderByAggregateInput
  }

  export type PricingConfigScalarWhereWithAggregatesInput = {
    AND?: PricingConfigScalarWhereWithAggregatesInput | PricingConfigScalarWhereWithAggregatesInput[]
    OR?: PricingConfigScalarWhereWithAggregatesInput[]
    NOT?: PricingConfigScalarWhereWithAggregatesInput | PricingConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PricingConfig"> | string
    loadFactorT1?: IntWithAggregatesFilter<"PricingConfig"> | number
    loadFactorT2?: IntWithAggregatesFilter<"PricingConfig"> | number
    timeBandBoost?: IntWithAggregatesFilter<"PricingConfig"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"PricingConfig"> | Date | string
  }

  export type PricingLogCreateInput = {
    id?: string
    tripId: string
    inputs: JsonNullValueInput | InputJsonValue
    price: number
    strategy: string
    createdAt?: Date | string
  }

  export type PricingLogUncheckedCreateInput = {
    id?: string
    tripId: string
    inputs: JsonNullValueInput | InputJsonValue
    price: number
    strategy: string
    createdAt?: Date | string
  }

  export type PricingLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tripId?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    price?: IntFieldUpdateOperationsInput | number
    strategy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricingLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tripId?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    price?: IntFieldUpdateOperationsInput | number
    strategy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricingLogCreateManyInput = {
    id?: string
    tripId: string
    inputs: JsonNullValueInput | InputJsonValue
    price: number
    strategy: string
    createdAt?: Date | string
  }

  export type PricingLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tripId?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    price?: IntFieldUpdateOperationsInput | number
    strategy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricingLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tripId?: StringFieldUpdateOperationsInput | string
    inputs?: JsonNullValueInput | InputJsonValue
    price?: IntFieldUpdateOperationsInput | number
    strategy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricingConfigCreateInput = {
    id?: string
    loadFactorT1?: number
    loadFactorT2?: number
    timeBandBoost?: number
    updatedAt?: Date | string
  }

  export type PricingConfigUncheckedCreateInput = {
    id?: string
    loadFactorT1?: number
    loadFactorT2?: number
    timeBandBoost?: number
    updatedAt?: Date | string
  }

  export type PricingConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    loadFactorT1?: IntFieldUpdateOperationsInput | number
    loadFactorT2?: IntFieldUpdateOperationsInput | number
    timeBandBoost?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricingConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    loadFactorT1?: IntFieldUpdateOperationsInput | number
    loadFactorT2?: IntFieldUpdateOperationsInput | number
    timeBandBoost?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricingConfigCreateManyInput = {
    id?: string
    loadFactorT1?: number
    loadFactorT2?: number
    timeBandBoost?: number
    updatedAt?: Date | string
  }

  export type PricingConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    loadFactorT1?: IntFieldUpdateOperationsInput | number
    loadFactorT2?: IntFieldUpdateOperationsInput | number
    timeBandBoost?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PricingConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    loadFactorT1?: IntFieldUpdateOperationsInput | number
    loadFactorT2?: IntFieldUpdateOperationsInput | number
    timeBandBoost?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PricingLogCountOrderByAggregateInput = {
    id?: SortOrder
    tripId?: SortOrder
    inputs?: SortOrder
    price?: SortOrder
    strategy?: SortOrder
    createdAt?: SortOrder
  }

  export type PricingLogAvgOrderByAggregateInput = {
    price?: SortOrder
  }

  export type PricingLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tripId?: SortOrder
    price?: SortOrder
    strategy?: SortOrder
    createdAt?: SortOrder
  }

  export type PricingLogMinOrderByAggregateInput = {
    id?: SortOrder
    tripId?: SortOrder
    price?: SortOrder
    strategy?: SortOrder
    createdAt?: SortOrder
  }

  export type PricingLogSumOrderByAggregateInput = {
    price?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PricingConfigCountOrderByAggregateInput = {
    id?: SortOrder
    loadFactorT1?: SortOrder
    loadFactorT2?: SortOrder
    timeBandBoost?: SortOrder
    updatedAt?: SortOrder
  }

  export type PricingConfigAvgOrderByAggregateInput = {
    loadFactorT1?: SortOrder
    loadFactorT2?: SortOrder
    timeBandBoost?: SortOrder
  }

  export type PricingConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    loadFactorT1?: SortOrder
    loadFactorT2?: SortOrder
    timeBandBoost?: SortOrder
    updatedAt?: SortOrder
  }

  export type PricingConfigMinOrderByAggregateInput = {
    id?: SortOrder
    loadFactorT1?: SortOrder
    loadFactorT2?: SortOrder
    timeBandBoost?: SortOrder
    updatedAt?: SortOrder
  }

  export type PricingConfigSumOrderByAggregateInput = {
    loadFactorT1?: SortOrder
    loadFactorT2?: SortOrder
    timeBandBoost?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use PricingLogDefaultArgs instead
     */
    export type PricingLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PricingLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PricingConfigDefaultArgs instead
     */
    export type PricingConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PricingConfigDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}