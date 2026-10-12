{
  description = "Event Registration & Notification System - Dev Env";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixfmt);

      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              bashInteractive
              nodejs_22
              pnpm
              prisma
              prisma-engines
              openssl
              pkg-config
              docker
              docker-compose
              git
              jq
            ];

            shellHook = ''
              export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig";
              export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"
            '';
          };
        }
      );
    };
}
