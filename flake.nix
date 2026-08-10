{
  description = "VoloScript TreeSitter Nix Dev Environment";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-26.05";
  };

  outputs = { self, nixpkgs, ... }:
  let
    systems = [ "x86_64-linux" "aarch64-linux" ];
    forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
  in
  {
    packages = forAllSystems (pkgs: rec {
      tree-sitter-voloscript = pkgs.tree-sitter.buildGrammar {
        language = "voloscript";
        version = "0.1.0";
        src = self;
      };

      default = tree-sitter-voloscript;
    });

    devShells = forAllSystems (pkgs: {
      default = pkgs.mkShell {
        packages = [
          pkgs.gcc
          pkgs.gnumake
          pkgs.nodejs_24
          pkgs.tree-sitter
        ];
      };
    });
  };
}
