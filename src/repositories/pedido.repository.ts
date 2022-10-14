import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Pedido, PedidoRelations, Persona, Producto} from '../models';
import {PersonaRepository} from './persona.repository';
import {ProductoRepository} from './producto.repository';

export class PedidoRepository extends DefaultCrudRepository<
  Pedido,
  typeof Pedido.prototype.Id,
  PedidoRelations
> {

  public readonly IdPersona: BelongsToAccessor<Persona, typeof Pedido.prototype.Id>;

  public readonly IdPedido: HasManyRepositoryFactory<Persona, typeof Pedido.prototype.Id>;

  public readonly producto: HasOneRepositoryFactory<Producto, typeof Pedido.prototype.Id>;

  constructor(
    @inject('datasources.MongoDB') dataSource: MongoDbDataSource, @repository.getter('PersonaRepository') protected personaRepositoryGetter: Getter<PersonaRepository>, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>,
  ) {
    super(Pedido, dataSource);
    this.producto = this.createHasOneRepositoryFactoryFor('producto', productoRepositoryGetter);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
    this.IdPedido = this.createHasManyRepositoryFactoryFor('IdPedido', personaRepositoryGetter,);
    this.registerInclusionResolver('IdPedido', this.IdPedido.inclusionResolver);
    this.IdPersona = this.createBelongsToAccessorFor('IdPersona', personaRepositoryGetter,);
    this.registerInclusionResolver('IdPersona', this.IdPersona.inclusionResolver);
  }
}
